import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody, 
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service'
import { Chat } from './schemas/chat.schema'
import { ChatService } from './chat.service'
import { JwtService } from '@nestjs/jwt';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { Message } from '../messages/schemas/messages.schema';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/users.schema';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatService:ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService
  ) {}
  
  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log("Client connected:"+client.id);    
    const sender:User = await this.jwtService.verify(client.handshake.auth.authorization);    
    const chats:Chat[] = await this.chatService.getAll(sender);        
    let users:User[] = await this.userService.getAll();    
    for (let chat of chats) {
      users = users.filter(user=>!chat.users.find(u=>JSON.stringify(u)==JSON.stringify(user)));
      client.join(chat._id.toString());
    }       
    client.emit('setChats',chats,users);  
  } 
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log("Client disconnected:"+client.id);     
  } 

  afterInit(server:Server) {
    this.server=server;    
  }

  @SubscribeMessage('getMessages')
  async handleMessages(@ConnectedSocket() client:Socket, @MessageBody() body:any){
    const sender:User = await this.jwtService.verify(client.handshake.auth.authorization);
    const recepient:User = await this.userService.getById(body.recepient._id);
    const users:User[] = [sender,recepient];    
    let chat: Chat = await this.chatService.getByUsers(users);
    if (!chat){      
      chat = await this.chatService.create({users});
      client.join(chat._id.toString());
    }
    const messages = await this.messagesService.getMessageByChat(chat);    
    client.emit('setMessages',messages);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body:SendMessageDto, @ConnectedSocket() client:Socket)  {
    const sender:User = await this.jwtService.verify(client.handshake.auth.authorization);
    const recepient:User = await this.userService.getById(body.recepient._id.toString());
    let users:User[] = [sender,recepient];    
    let chat: Chat = await this.chatService.getByUsers(users);
    if (!chat){
      chat = await this.chatService.create({users});
      client.join(chat._id.toString());
    }
    const createMessageDto:CreateMessageDto = {content:body.content,chat, sender_id:sender._id};
    const message:Message = await this.messagesService.create(createMessageDto);
    this.server.to(chat._id.toString()).emit('getMessage',message);
    
    const chatsOfSender:Chat[] = await this.chatService.getAll(sender); 
    const chatsOfRecepient:Chat[] = await this.chatService.getAll(recepient); 
    users = await this.userService.getAll();    
    for (let chat of chatsOfSender) {
      users = users.filter(user=>!chat.users.find(u=>JSON.stringify(u)==JSON.stringify(user)));
    }   
    client.emit('setChats',chatsOfSender,users); 
    for (let chat of chatsOfRecepient) {
      users = users.filter(user=>!chat.users.find(u=>JSON.stringify(u)==JSON.stringify(user)));
    }                     
    this.server.to(chat._id.toString()).emit('setChats',chatsOfRecepient,users,true);     
  }
}