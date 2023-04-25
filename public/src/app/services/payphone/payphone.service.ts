import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptionsPayphone = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer smoRJ7oR-vsNuXbxE-37zYhlF-NTYqaRYpHNo_NaphKujBVqkzp3xsRRahQSArWl8DnDb6LNjZKrvYu-W_2x80rl9kR2NDPRBz7DRo_0iKZqzJYh--Lx9bUGZnXKIMVCsyJv4vw6meGgBR0oMT7UOimrqLG8GHEu62-dZvCgCFd12wGMe5M2-JJXf0S-6RERlZGVSTIvYHMeak3rTxLMYHJCh3jN_jjpEf8DWVTU0-flZ4ALeKJK-IJ3P5t1g_U8k3Vly0_FDVANmP6CNg4473tdWfBfpyPJPA68KHsRZKbhfCfUq-UaVlJUIjBirZ1uSa4y4Q"
  })
};

@Injectable({
  providedIn: 'root'
})
export class PayphoneService {

  constructor(
    private http: HttpClient
  ) { }

  send_payment_payphone(
    data: string
  ): Observable <HttpResponse<any>>{
    return this.http
      .post<any>(
        "https://pay.payphonetodoesposible.com/api/v2/transaction/Create",
        // "https://pay.payphonetodoesposible.com/api/Sale",
        data,
        httpOptionsPayphone
      );
  }
}
