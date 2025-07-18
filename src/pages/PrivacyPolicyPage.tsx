import React from 'react';
import Container from '../components/layout/Container';
import Footer from '../components/elements/Footer';
import NavBar from '../components/elements/NavBar';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <Container>
        <div className="page-content">
          <h1>Privacy Policy</h1>
          <p>
            Last updated: July 3, 2025
          </p>
          <p>
            Grow Garden ("us", "we", or "our") operates the Grow Garden gaming website (the "Service").
          </p>
          <p>
            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our gaming Service and the choices you have associated with that data. We use your data to provide and improve our online gaming experience. By using the Service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2>Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>

          <h3>Types of Data Collected</h3>
          <h3>Personal Data</h3>
          <div>
            While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Cookies and Usage Data</li>
            </ul>
          </div>
          <h3>Usage Data</h3>
          <p>
            We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
          </p>
          <h3>Tracking & Cookies Data</h3>
          <p>
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
          </p>

          <h2>Use of Data</h2>
          <p>
            Grow Garden uses the collected data for various purposes:
            <ul>
              <li>To provide and maintain our gaming Service</li>
              <li>To notify you about changes to our gaming Service</li>
              <li>To allow you to participate in interactive gaming features when you choose to do so</li>
              <li>To provide customer care and support for our games</li>
              <li>To provide analysis or valuable information so that we can improve our gaming experience</li>
              <li>To monitor the usage of our gaming Service</li>
              <li>To detect, prevent and address technical issues with our games</li>
            </ul>
          </p>

          <h2>Security of Data</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
          <p>
            dongshan1025@gmail.com
          </p>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;