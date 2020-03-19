import { ServicesService, MTransaction, MWallet } from './../../services/services.service';
import { TransferInputPage } from './../transfer_input/transfer-input.page';
import { TransactionCategoryPage } from './../transaction_category/transaction-category.page';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, NavParams, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-input',
  templateUrl: './transaction-input.page.html',
  styleUrls: ['./transaction-input.page.scss'],
})
export class TransactionInputPage implements OnInit {

  private type_input: string;
  private id:string;

  private temp_balance_update : number
  private  edit_MWallet:MWallet = {
    username: null,
    wallet_name: null,
    wallet_balance : null,
    wallet_active: null
  }

  private editMTransaction:MTransaction = {
    username : null,
    wallet_name : null,
    categories_type : null,
    categories_name : null,
    sub_categories_name : null,
    transaction_amount : null,
    transaction_date : null,
    transaction_note : null,
    transaction_active : null
  }

  private MTransaction:MTransaction = {
    username : null,
    wallet_name : null,
    categories_type : null,
    categories_name : null,
    sub_categories_name : null,
    transaction_amount : null,
    transaction_date : null,
    transaction_note : null,
    transaction_active : null
  }
 
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
    private navParams: NavParams,
    private servicesService: ServicesService,
  ) { 
      this.type_input = navParams.get('type_input');
      if(this.type_input == "insert"){
        // this.MTransaction.transaction_date = Date();
      }
      this.id = navParams.get('id');
      this.editMTransaction.categories_name= navParams.get('categories_name');
      this.editMTransaction.categories_type= navParams.get('categories_type');
      this.editMTransaction.sub_categories_name= navParams.get('sub_categories_name');
      this.editMTransaction.transaction_amount= navParams.get('transaction_amount');
      this.editMTransaction.transaction_active= navParams.get('transaction_active');
      this.editMTransaction.transaction_date= navParams.get('transaction_date');
      this.editMTransaction.transaction_note= navParams.get('transaction_note');
      this.editMTransaction.username= navParams.get('username');
      this.editMTransaction.wallet_name= navParams.get('wallet_name');

      this.temp_balance_update = navParams.get('transaction_amount');

    }
 
  ngOnInit() {
  }

  // * @Function   : select_category_alert => แสดง Select สำหรับเลือก Category Type
  // * @Author     : Jiramate Phuaphan
  // * @Create Date: 2563-03-02
  async select_category_alert() {
    const alert = await this.alertController.create({
      header: 'Select Category',
      buttons: [
        {
          text: 'Income',
          cssClass: 'secondary',
          handler: () => {
            this.modal_taransaction_category_show("income")
          }
        },
        {
          text: 'Expense',
          cssClass: 'secondary',
          handler: () => {
            this.modal_taransaction_category_show("expense")
          }
        },
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  // * @Function   : modal_taransaction_category_show => แสดง Modal TransactionCategoryPage และ ตอนปิด Modal จะ Passing Data กลับมา
  // * @Author     : Jiramate Phuaphan
  // * @Create Date: 2563-03-02
  async modal_taransaction_category_show(type: string) {
    const modal = await this.modalController.create({
      component: TransactionCategoryPage,
      componentProps: {
        'type_input': type
      }
    });
    modal.onDidDismiss()
    .then((data) => {
      this.MTransaction.categories_type = data['data']['categories_type'];
      this.MTransaction.categories_name = data['data']['categories_name'];
      this.MTransaction.sub_categories_name = data['data']['sub_categories_name'];

      this.editMTransaction.categories_type = data['data']['categories_type'];
      this.editMTransaction.categories_name = data['data']['categories_name'];
      this.editMTransaction.sub_categories_name = data['data']['sub_categories_name'];
    });
    return await modal.present();
  }

  // * @Function   : showToast => แสดง Toast
  // * @Author     : Jiramate Phuaphan
  // * @Create Date: 2563-03-01
  showToast(msg) {
    this.toastController.create({
      message: msg,
      duration: 2000
    }).then(toast => toast.present());
  }

  // * @Function   : close_modal => คำสั่งปิด modal
  // * @Author     : Jiramate Phuaphan
  // * @Create Date: 2563-03-01
  async close_modal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  // * @Function   : insert_transaction => เพิ่มข้อมูล transaction
  // * @Author     : Kanathip Phithaksilp
  // * @Create Date: 2563-03-06
  async insert_transaction() {
    if(this.MTransaction.transaction_amount == null){
      this.showToast('Please fill in balance.');
    }else if(this.MTransaction.sub_categories_name == null || this.MTransaction.sub_categories_name == ""){
      this.showToast('Please fill in category.');
    }else if(this.MTransaction.transaction_date == null || this.MTransaction.transaction_date == ""){
      this.showToast('Please fill in date.');
    }else{
      this.MTransaction.username = this.servicesService.SessionService.get_session_username();
      this.MTransaction.wallet_name = this.servicesService.SessionService.get_session_wallet();
      this.MTransaction.transaction_active = "Y"
      var wallet_id = this.servicesService.SessionService.get_session_wallet_id()
      await this.servicesService.MTransactionService.insert_transaction(this.MTransaction).then(() => {
        this.showToast('Add transaction successful.');
       
      });

      await this.servicesService.MWalletService.get_edit_wallet(wallet_id).subscribe( res => {
        this.edit_MWallet = res;
        if(this.MTransaction.categories_type == 1){
          this.edit_MWallet.wallet_balance += this.MTransaction.transaction_amount
        }else if(this.MTransaction.categories_type == 2){
          this.edit_MWallet.wallet_balance -= this.MTransaction.transaction_amount
        }
        this.servicesService.MWalletService.update_wallet_name(wallet_id,this.edit_MWallet)
      })

      this.close_modal();
    }
  }

  // * @Function   : edit_transaction => เเก้ไขข้อมูล transaction
  // * @Author     : Kanathip Phithaksilp
  // * @Create Date: 2563-03-06
  async update_transaction(){
    if(this.editMTransaction.transaction_amount == null){
      this.showToast('Please fill in balance.');
    }else if(this.editMTransaction.sub_categories_name == null || this.editMTransaction.sub_categories_name == ""){
      this.showToast('Please fill in category.');
    }else if(this.editMTransaction.transaction_date == null || this.editMTransaction.transaction_date == ""){
      this.showToast('Please fill in date.');
    }else{
      this.editMTransaction.username = this.servicesService.SessionService.get_session_username();
      this.editMTransaction.wallet_name = this.servicesService.SessionService.get_session_wallet();
      this.editMTransaction.transaction_active = "Y"
      var wallet_id = this.servicesService.SessionService.get_session_wallet_id()
      this.servicesService.MTransactionService.update_transaction( this.id,this.editMTransaction).then(() => {
        this.showToast('Edit transaction successful.');
      });
      this.close_modal();

      await this.servicesService.MWalletService.get_edit_wallet(wallet_id).subscribe( res => {
        this.edit_MWallet = res;
        if(this.temp_balance_update != this.editMTransaction.transaction_amount){
          if(this.temp_balance_update  > this.editMTransaction.transaction_amount){
            var sum = this.editMTransaction.transaction_amount - this.temp_balance_update
          }else{
            var sum = this.editMTransaction.transaction_amount - this.temp_balance_update
          }
          if(this.editMTransaction.categories_type == 1){
            this.edit_MWallet.wallet_balance += sum
          }else if(this.editMTransaction.categories_type == 2){
            this.edit_MWallet.wallet_balance -= sum
          }
        }
        this.servicesService.MWalletService.update_wallet_name(wallet_id,this.edit_MWallet)
      })

    }
  }
}
