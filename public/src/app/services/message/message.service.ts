import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private firestore: AngularFirestore

  ) { }

  //Crea una nueva categoria
  public createMessage(message: Message) {
    return this.firestore.collection('message').doc(message.message_id).set(message);
  }

  public getMessages() {
    return this.firestore.collection('message', ref => ref.orderBy('message_id', 'desc')).valueChanges();
  }
  public getDenuncias() {
    return this.firestore.collection('comment_complaint').valueChanges();
  }

  public deleteCommentary(c) {
    this.firestore.collection('novelty').doc(c.novelty.novelty_id).collection('comments').doc(c.commentary.commentary_id).delete();
    return this.firestore.collection('comment_complaint').doc(c.commentary.commentary_id).delete();
  }
}
