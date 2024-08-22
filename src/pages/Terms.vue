<template>
    <div class="q-grid p30 left">
      <div class="q-cell-1">
        <section>
          <h3>1. Acceptance of Terms</h3>
          <p>1.1. By accessing or using {{ site_name }}'s services, you agree to comply with and be bound by these Terms of Service.</p>
          <p>1.2. If you do not agree with these Terms of Service, please do not use our services.</p>
        </section>
    
        <section>
          <h3>2. Definitions</h3>
          <p>2.1. "Services" refers to all products, features, and functionality provided by {{ site_name }}, including but not limited to account linking, transaction categorization, and transaction history retrieval.</p>
        </section>
    
        <section>
          <h3>3. User Accounts</h3>
          <p>3.1. You are responsible for maintaining the confidentiality of your account credentials.</p>
          <p>3.2. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
          <p>3.3. {{ site_name }} reserves the right to terminate accounts found to be in violation of these Terms of Service.</p>
        </section>
    
        <section>
          <h3>4. Privacy</h3>
          <p>4.1. {{ site_name }} values your privacy. Please review our Privacy Policy, which outlines how we collect, use, and share your data.</p>
        </section>
    
        <section>
          <h3>5. User Conduct</h3>
          <p>5.1. You agree not to:</p>
          <ul>
              <li>a. Use the services for any illegal or unauthorized purpose.</li>
              <li>b. Interfere with or disrupt the services or servers.</li>
              <li>c. Violate any applicable laws, rules, or regulations.</li>
          </ul>
        </section>
    
        <section>
          <h3>6. Intellectual Property</h3>
          <p>6.1. All content, trademarks, service marks, logos, and intellectual property displayed on our services are the property of {{ site_name }} or its licensors.</p>
          <p>6.2. You may not use, reproduce, distribute, or modify any of our intellectual property without prior written consent.</p>
        </section>
    
        <section>
          <h3>7. Termination</h3>
          <p>7.1. {{ site_name }} reserves the right to terminate or suspend your access to the services at any time, for any reason, without notice.</p>
        </section>
    
        <section>
          <h3>8. Disclaimers</h3>
          <p>8.1. {{ site_name }} provides the services "as is" and makes no warranties or representations regarding their availability, reliability, or accuracy.</p>
        </section>
    
        <section>
          <h3>9. Limitation of Liability</h3>
          <p>9.1. To the extent permitted by law, {{ site_name }} will not be liable for any direct, indirect, incidental, special, or consequential damages arising from or in connection with the use of our services.</p>
        </section>
    
        <section>
          <h3>10. Indemnification</h3>
          <p>10.1. You agree to indemnify and hold {{ site_name }}, its affiliates, and its officers, employees, and agents harmless from any claims, liabilities, losses, and expenses.</p>
        </section>
    
        <section>
          <h3>11. Governing Law</h3>
          <p>11.1. These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, United States.</p>
        </section>
    
        <section>
          <h3>12. Changes to Terms</h3>
          <p>12.1. {{ site_name }} reserves the right to update or modify these Terms of Service at any time. Your continued use of the services after such changes will constitute your acceptance of the new terms.</p>
        </section>
    
        <section>
          <h3>13. Contact Information</h3>
          <p>13.1. For questions or concerns about these Terms of Service, please contact {{ site_name }} at {{ contact_email }}.</p>
        </section>
    
        <section>
          <h3>14. Entire Agreement</h3>
          <p>14.1. These Terms of Service constitute the entire agreement between you and {{ site_name }} regarding the use of our services.</p>
        </section>
    
        <section>
          <p>Contact Information: For questions or concerns about these Terms of Service, please contact {{ site_name }} at {{ contact_email }}.</p>
        </section>
      </div>
    </div>
    </template>
    
<script setup>
import { contact_email, site_name } from '../config';
</script>