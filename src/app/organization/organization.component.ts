import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  orgnizationList : any = [];
  showOrgnizationInfo: boolean = false;
  showOrgnizationForm: boolean = false;
  selectedOrgnization: any = null;
  showOrgnizationContactForm : boolean = false;
  selectedOrgnizationContact : any = null;
  showOrgnizationContact: boolean = false;
  orgnizationImage: any = null;
  contactImage: any = null;

  constructor(private commonService: CommonService) { }

  ngOnInit() {    
    this.getList();
  }

  /* Get Organization List for First Coulmn */
  getList(orgId = null) {
    this.commonService.getList().subscribe((data)=>{
      console.log(data);
      this.orgnizationList = data['data'];
      if(orgId !== null){
        this.showOrgnization(orgId);
      }
    });
    
    //console.log(this.orgnizationList);
  }

  /* On click organization show details in second column */
  showOrgnization(id) {
    this.showOrgnizationForm = false;
    this.showOrgnizationInfo = true;
    this.selectedOrgnization = this.orgnizationList.find(x => x.id == id);
    //console.log('Organization details '+id);
  }

  /* Show orgnization form on add btton */
  orgnizationForm() {
    this.showOrgnizationInfo = false;
    this.showOrgnizationForm = true;
    this.showOrgnizationContactForm = false;
    this.showOrgnizationContact = false;
  }

  /* Get uploaded file */
  fileOrgnization(fileInput: any){
    this.orgnizationImage = fileInput.target.files[0];
    //console.log(this.orgnizationImage);
  }

  /* submit orgnization details */
  onSubmit(forms) {
    //console.log(forms.value);
    //console.log(this.orgnizationImage);
    let newOrgnization = {        
        'orgn_name': forms.value.name,
        'orgn_logo': this.orgnizationImage,
        'orgn_email': forms.value.email
    }
    this.commonService.createOrganization(newOrgnization).subscribe((data) =>{
      if(data['code'] == 200){
        console.log('Organization added successfully');
        this.getList();
      }else{
        console.log(data);
      }
    });

    //this.orgnizationList.push(newOrgnization);
    //console.log(this.orgnizationList);
    this.contactImage = null;
    forms.reset();
  }  
  
  /* show orgnization contact form */
  newOrgnizationContact() {    
    this.showOrgnizationContactForm = true;
    this.showOrgnizationContact = false;
  }

  /* show organization details */
  orgnizationContact(contact) {
    this.showOrgnizationContactForm = false;
    this.showOrgnizationContact = true;
    this.selectedOrgnizationContact = contact;
  }

  /* get contact image */
  fileContact(fileInput: any){
    this.contactImage = fileInput.target.files[0];
    //console.log(this.contactImage);
  }

  /* add organization contact details */
  onSubmitContact(forms) {
    //console.log(forms.value);
    //console.log(this.selectedOrgnization.id);
    forms.value.contact_photo = this.contactImage;
    let contactDetails = {
      'contact_address': forms.value.contact_address,
      'contact_email': forms.value.contact_email,
      'contact_name': forms.value.contact_name,
      'contact_no': forms.value.contact_no,
      'contact_photo':  this.contactImage,
      'orgn_id': this.selectedOrgnization.id
    };

    this.commonService.addOrganizationContact(contactDetails).subscribe((data) => {
      console.log(data)
      if(data['code'] == 200){
        console.log('Contact details added successfully');
        this.showOrgnizationContact = false;
        this.showOrgnizationContactForm = false;
        this.getList(this.selectedOrgnization.id);
      }
    });
    
    forms.reset();
    this.contactImage = null;
  }
}
