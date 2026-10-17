import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  footerLinks = {
    about: ['About Us', 'Careers', 'Press', 'Investor Relations'],
    help: ['Payments', 'Shipping', 'Returns', 'FAQ'],
    policy: ['Return Policy', 'Terms of Use', 'Privacy', 'Security'],
    sell: ['Become a Seller', 'Advertise', 'Seller Hub']
  };
}
