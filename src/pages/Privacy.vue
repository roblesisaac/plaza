<template>
	<div class="q-grid">
		<div class="q-cell-1 p30">
			<section>
				<h3>Encryption in Transit</h3>
				<p>All data transmitted between your device and our servers is encrypted using industry-standard Secure Socket Layer (SSL) and Transport Layer Security (TLS) protocols. This encryption ensures that your data remains confidential during transmission, reducing the risk of interception by unauthorized parties.</p>
			</section>
			
			<section>
				<h3>Encryption at Rest</h3>
				<p>Your sensitive data, once stored in our database, is also protected through encryption. We use advanced encryption methods to secure your information while it is stored on our servers. This means that even if someone gains unauthorized access to our database, they will not be able to decipher your data without the necessary encryption keys.</p>
			</section>
			
			<section>
				<h3>Access Control</h3>
				<p>Access to your data is strictly controlled and limited to authorized personnel who require it for legitimate purposes. We have implemented role-based access control mechanisms to ensure that only the individuals with the appropriate permissions can access and manipulate your data.</p>
			</section>
			
			<section>
				<h3>Regular Audits and Monitoring</h3>
				<p>We conduct regular security audits and monitoring of our systems to identify and address any vulnerabilities or threats. This proactive approach helps us stay ahead of potential security risks.</p>
			</section>
			
			<section>
				<h3>Data Retention</h3>
				<p>We only retain your data for as long as it is necessary for the purposes for which it was collected. Once your data is no longer needed, it is securely deleted from our systems to minimize any potential exposure.</p>
			</section>
			
			<section>
				<h3>User Authentication</h3>
				<p>We require strong user authentication to ensure that only authorized users can access your account and data. This includes password policies and, where applicable, two-factor authentication (2FA) to enhance account security.</p>
			</section>
			
			<section>
				<h3>Third-Party Services</h3>
				<p>In some cases, we may use third-party services to enhance our functionality. These services are carefully vetted for their security practices and comply with relevant data protection regulations.</p>
			</section>
			
			<section>
				<h3>Your Responsibilities</h3>
				<p>While we take every precaution to protect your data, it's important for you, as a user, to play your part in ensuring data security. This includes using strong, unique passwords and keeping your login credentials confidential. Additionally, please be cautious about sharing sensitive information or clicking on suspicious links or emails.</p>
			</section>
			
			<section>
				<h3>Questions or Concerns</h3>
				<p>If you have any questions or concerns about how we handle your data or if you suspect any security issues, please contact our support team at {{ contact_email }}.</p>
			</section>
		</div>
	</div>
</template>

<script setup>
import { contact_email } from '../config';
</script>