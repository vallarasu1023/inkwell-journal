import { Link } from 'react-router-dom';

const PageLayout = ({ title, subtitle, children }) => (
  <div style={{ background: '#fff', minHeight: '100vh' }}>
    {/* Hero */}
    <div style={{ background: '#fafafa', borderBottom: '1px solid #e6e6e6', padding: '80px 24px 60px' }}>
      <div style={{ maxWidth: 728, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 48, fontWeight: 700, color: '#242424', marginBottom: 16, lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 20, color: '#6b6b6b', lineHeight: 1.6 }}>{subtitle}</p>}
      </div>
    </div>
    {/* Content */}
    <div style={{ maxWidth: 728, margin: '0 auto', padding: '48px 24px 80px' }}>
      {children}
    </div>
  </div>
);

const P = ({ children }) => <p style={{ fontSize: 18, lineHeight: 1.8, color: '#242424', marginBottom: 24 }}>{children}</p>;
const H = ({ children }) => <h2 style={{ fontFamily: 'Lora, serif', fontSize: 28, fontWeight: 700, color: '#242424', margin: '48px 0 16px', borderBottom: '1px solid #e6e6e6', paddingBottom: 12 }}>{children}</h2>;
const Small = ({ children }) => <p style={{ fontSize: 14, color: '#9b9b9b', marginBottom: 8 }}>{children}</p>;

export function Help() {
  const faqs = [
    { q: 'How do I create an account?', a: 'Click Sign Up at the top right corner of the page. Enter your name, email and password to get started in seconds.' },
    { q: 'How do I publish a story?', a: 'Click the Write button in the navbar. Add your title, content and a cover image, then click Publish to share your story with the world.' },
    { q: 'Can I edit my story after publishing?', a: 'Yes! Go to your profile, find the story you want to edit and click the edit button. Your changes will be updated immediately.' },
    { q: 'How do I follow a writer?', a: 'Visit any writer\'s profile page and click the Follow button. You will see their latest stories in your feed.' },
    { q: 'How do I bookmark a story?', a: 'Click the bookmark icon on any story to save it to your reading list. Access your saved stories from the Bookmarks page.' },
    { q: 'How do I delete my account?', a: 'To delete your account, please contact us at support@inkwell.com and we will process your request within 48 hours.' },
  ];

  return (
    <PageLayout title="Help Center" subtitle="Everything you need to know about Inkwell.">
      <div style={{ display: 'grid', gap: 24, marginBottom: 48 }}>
        {faqs.map(({ q, a }) => (
          <div key={q} style={{ border: '1px solid #e6e6e6', borderRadius: 8, padding: '24px 28px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#242424', marginBottom: 10 }}>{q}</h3>
            <p style={{ fontSize: 16, color: '#6b6b6b', lineHeight: 1.7 }}>{a}</p>
          </div>
        ))}
      </div>
      <div style={{ background: '#fafafa', border: '1px solid #e6e6e6', borderRadius: 8, padding: '32px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Lora, serif', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Still have questions?</h3>
        <p style={{ color: '#6b6b6b', marginBottom: 20, fontSize: 16 }}>Our support team is happy to help you.</p>
        <a href="mailto:support@inkwell.com" style={{ padding: '12px 28px', background: '#242424', color: '#fff', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Contact Support</a>
      </div>
    </PageLayout>
  );
}

export function Status() {
  const services = [
    { name: 'Web Application', status: 'Operational', ok: true },
    { name: 'API Services', status: 'Operational', ok: true },
    { name: 'Database', status: 'Operational', ok: true },
    { name: 'Image Search', status: 'Operational', ok: true },
    { name: 'Authentication', status: 'Operational', ok: true },
  ];

  return (
    <PageLayout title="System Status" subtitle="Real-time status of all Inkwell services.">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 24px', background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 8, marginBottom: 40 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#1a8917', flexShrink: 0 }}></div>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#1a8917' }}>All systems are fully operational</span>
      </div>
      <div style={{ border: '1px solid #e6e6e6', borderRadius: 8, overflow: 'hidden', marginBottom: 40 }}>
        {services.map(({ name, status, ok }, i) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: i < services.length - 1 ? '1px solid #e6e6e6' : 'none' }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: '#242424' }}>{name}</span>
            <span style={{ fontSize: 14, color: ok ? '#1a8917' : '#c00', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: ok ? '#1a8917' : '#c00', display: 'inline-block' }}></span>
              {status}
            </span>
          </div>
        ))}
      </div>
      <Small>Last checked: {new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</Small>
    </PageLayout>
  );
}

export function About() {
  return (
    <PageLayout title="About Inkwell" subtitle="A place where ideas come to life.">
      <P>Inkwell is a modern publishing platform built for writers, thinkers, and curious minds. We believe that everyone has a story worth telling — and we have built the tools to help you tell it beautifully.</P>
      <H>Our Mission</H>
      <P>We exist to make great writing more accessible. In a world full of noise, we want Inkwell to be a space where quality ideas rise to the top — where readers discover stories that genuinely move them, and writers find an audience that appreciates their work.</P>
      <H>Who We Are</H>
      <P>Inkwell was founded in 2024 by a small team of writers and engineers who were frustrated with existing blogging platforms. We wanted something cleaner, faster and more focused on the writing itself. So we built it.</P>
      <H>What Makes Us Different</H>
      <P>We do not chase clicks or optimize for outrage. We optimize for depth. Our platform rewards writers who take the time to craft thoughtful, well-written pieces — and readers who want to engage with ideas seriously.</P>
      <H>Join Us</H>
      <P>Whether you are a seasoned journalist or someone who has never published a word online, Inkwell is your home. <Link to="/signup" style={{ color: '#1a8917', fontWeight: 600 }}>Create your free account</Link> and start writing today.</P>
    </PageLayout>
  );
}

export function Careers() {
  const jobs = [
    { title: 'Senior Frontend Engineer', type: 'Full Time', location: 'Remote', desc: 'Help us build the next generation of our writing and reading experience using React and modern web technologies.' },
    { title: 'Backend Engineer', type: 'Full Time', location: 'Remote', desc: 'Work on our Node.js API and MongoDB infrastructure to scale Inkwell to millions of writers and readers.' },
    { title: 'Product Designer', type: 'Full Time', location: 'Remote', desc: 'Shape the visual and interaction design of Inkwell. We care deeply about craft and attention to detail.' },
    { title: 'Content Strategist', type: 'Part Time', location: 'Remote', desc: 'Help grow our community of writers through curated content, partnerships and editorial strategy.' },
  ];

  return (
    <PageLayout title="Careers" subtitle="Help us build the future of publishing.">
      <P>We are a small, passionate team working on something we genuinely believe in. If you care about great writing and want to build tools that help people share their ideas with the world, we would love to meet you.</P>
      <H>Open Positions</H>
      <div style={{ display: 'grid', gap: 20, marginBottom: 48 }}>
        {jobs.map(({ title, type, location, desc }) => (
          <div key={title} style={{ border: '1px solid #e6e6e6', borderRadius: 8, padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#242424' }}>{title}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ padding: '4px 12px', background: '#f2f2f2', borderRadius: 999, fontSize: 13, color: '#6b6b6b' }}>{type}</span>
                <span style={{ padding: '4px 12px', background: '#f2f2f2', borderRadius: 999, fontSize: 13, color: '#6b6b6b' }}>{location}</span>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#6b6b6b', lineHeight: 1.7, marginBottom: 16 }}>{desc}</p>
            <a href="mailto:careers@inkwell.com" style={{ fontSize: 14, color: '#1a8917', fontWeight: 600 }}>Apply Now →</a>
          </div>
        ))}
      </div>
      <div style={{ background: '#fafafa', border: '1px solid #e6e6e6', borderRadius: 8, padding: '32px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Lora, serif', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Don't see your role?</h3>
        <p style={{ color: '#6b6b6b', marginBottom: 20, fontSize: 16 }}>Send us your resume anyway. We are always looking for exceptional people.</p>
        <a href="mailto:careers@inkwell.com" style={{ padding: '12px 28px', background: '#242424', color: '#fff', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Get in Touch</a>
      </div>
    </PageLayout>
  );
}

export function Press() {
  const releases = [
    { date: 'March 2025', title: 'Inkwell Launches Pexels-Powered Image Search', desc: 'Writers can now search millions of high quality photos directly from the Inkwell editor.' },
    { date: 'January 2025', title: 'Inkwell Reaches 10,000 Published Stories', desc: 'Just three months after launch, Inkwell celebrates a major milestone with its growing community.' },
    { date: 'October 2024', title: 'Inkwell Officially Launches to the Public', desc: 'After months of development, Inkwell opens its doors to writers and readers around the world.' },
  ];

  return (
    <PageLayout title="Press" subtitle="News, updates and media resources from Inkwell.">
      <H>Press Releases</H>
      <div style={{ display: 'grid', gap: 0, marginBottom: 48 }}>
        {releases.map(({ date, title, desc }, i) => (
          <div key={title} style={{ padding: '28px 0', borderBottom: '1px solid #e6e6e6' }}>
            <Small>{date}</Small>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#242424', marginBottom: 8, marginTop: 4 }}>{title}</h3>
            <p style={{ fontSize: 15, color: '#6b6b6b', lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>
      <H>Media Inquiries</H>
      <P>For press and media inquiries, interview requests or brand assets, please reach out to our communications team.</P>
      <a href="mailto:press@inkwell.com" style={{ padding: '12px 28px', background: '#242424', color: '#fff', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Contact Press Team</a>
    </PageLayout>
  );
}

export function BlogPage() {
  const posts = [
    { date: 'March 10, 2025', title: 'Introducing Image Search: Find the Perfect Cover Photo', desc: 'We have partnered with Pexels to bring millions of free, high quality images directly into the Inkwell writing experience.' },
    { date: 'February 2025', title: 'How We Built Inkwell in 90 Days', desc: 'A behind the scenes look at the design decisions, technical choices and late nights that went into building Inkwell from scratch.' },
    { date: 'January 2025', title: 'The Future of Online Publishing', desc: 'What does the next decade of online writing look like? We share our vision for a better, more human internet.' },
  ];

  return (
    <PageLayout title="Inkwell Blog" subtitle="Updates, stories and insights from our team.">
      <div style={{ display: 'grid', gap: 0 }}>
        {posts.map(({ date, title, desc }) => (
          <div key={title} style={{ padding: '36px 0', borderBottom: '1px solid #e6e6e6' }}>
            <Small>{date}</Small>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: 26, fontWeight: 700, color: '#242424', marginBottom: 12, marginTop: 8, lineHeight: 1.3 }}>{title}</h2>
            <p style={{ fontSize: 16, color: '#6b6b6b', lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export function Privacy() {
  return (
    <PageLayout title="Privacy Policy" subtitle="Last updated: January 2025">
      <P>At Inkwell, your privacy is important to us. This policy explains what information we collect, how we use it, and what rights you have over your data.</P>
      <H>Information We Collect</H>
      <P>We collect information you provide directly, such as your name, email address and password when you create an account. We also collect information about how you use our platform, such as which stories you read and interact with.</P>
      <H>How We Use Your Information</H>
      <P>We use your information to provide and improve our services, personalise your reading experience, send you updates about the platform, and ensure the security of your account.</P>
      <H>Data Sharing</H>
      <P>We do not sell your personal data to third parties. We may share anonymised, aggregated data to understand how our platform is used and to improve our services.</P>
      <H>Your Rights</H>
      <P>You have the right to access, correct or delete your personal data at any time. To make a request, contact us at privacy@inkwell.com and we will respond within 30 days.</P>
      <H>Cookies</H>
      <P>We use cookies to keep you signed in and to understand how you use our platform. You can disable cookies in your browser settings, though some features may not work correctly.</P>
      <H>Contact</H>
      <P>If you have any questions about this Privacy Policy, please contact us at privacy@inkwell.com.</P>
    </PageLayout>
  );
}

export function Rules() {
  const rules = [
    { title: 'Be Respectful', desc: 'Treat every person on Inkwell with dignity and respect. Harassment, bullying, hate speech and personal attacks will not be tolerated under any circumstances.' },
    { title: 'Write Original Content', desc: 'Only publish content that you have created yourself. Plagiarism, copying and republishing others\' work without permission is strictly prohibited.' },
    { title: 'No Spam or Self Promotion', desc: 'Do not flood the platform with repetitive, low quality or purely promotional content. Stories should offer genuine value to readers.' },
    { title: 'Keep It Legal', desc: 'Do not post content that is illegal, defamatory, or that infringes on the intellectual property rights of others.' },
    { title: 'Protect Privacy', desc: 'Do not share personal information about other people without their consent. Respect the privacy of individuals both on and off the platform.' },
    { title: 'Be Honest', desc: 'Do not spread misinformation or deliberately misleading content. Label opinion pieces clearly and be transparent about your sources.' },
  ];

  return (
    <PageLayout title="Community Rules" subtitle="Guidelines for a respectful, high quality community.">
      <P>Inkwell is built on the belief that great writing deserves a great community. These rules exist to protect that community and ensure everyone can participate safely and comfortably.</P>
      <div style={{ display: 'grid', gap: 20, margin: '40px 0' }}>
        {rules.map(({ title, desc }, i) => (
          <div key={title} style={{ display: 'flex', gap: 20, padding: '24px', border: '1px solid #e6e6e6', borderRadius: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#242424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#242424', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 15, color: '#6b6b6b', lineHeight: 1.7 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <P>Violations of these rules may result in content removal or account suspension. If you see content that violates our rules, please report it to rules@inkwell.com.</P>
    </PageLayout>
  );
}

export function Terms() {
  return (
    <PageLayout title="Terms of Service" subtitle="Last updated: January 2025">
      <P>By using Inkwell, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.</P>
      <H>Your Account</H>
      <P>You are responsible for maintaining the security of your account and for all activity that occurs under it. You must provide accurate information when creating your account and keep it up to date.</P>
      <H>Your Content</H>
      <P>You retain full ownership of the content you publish on Inkwell. By publishing, you grant us a non-exclusive license to display, distribute and promote your content on our platform and in our marketing materials.</P>
      <H>Our Rights</H>
      <P>We reserve the right to remove content that violates our Community Rules or Terms of Service, and to suspend or terminate accounts that repeatedly violate our policies.</P>
      <H>Disclaimer</H>
      <P>Inkwell is provided as-is without warranties of any kind. We are not responsible for content published by users or for any damages arising from your use of the platform.</P>
      <H>Changes to Terms</H>
      <P>We may update these Terms from time to time. We will notify you of significant changes by email or through a notice on the platform. Continued use of Inkwell after changes constitutes acceptance of the new Terms.</P>
      <H>Contact</H>
      <P>For questions about these Terms, contact us at legal@inkwell.com.</P>
    </PageLayout>
  );
}

export function TextToSpeech() {
  return (
    <PageLayout title="Text to Speech" subtitle="Listen to stories, hands-free.">
      <P>Inkwell's text to speech feature lets you listen to any story on our platform. Whether you are commuting, exercising or just prefer to listen, we have you covered.</P>
      <H>How to Use</H>
      <div style={{ display: 'grid', gap: 16, margin: '24px 0 40px' }}>
        {[
          { step: '1', title: 'Open any story', desc: 'Navigate to any story on Inkwell that you want to listen to.' },
          { step: '2', title: 'Click the speaker icon', desc: 'Find the speaker icon in the story toolbar and click it to start listening.' },
          { step: '3', title: 'Adjust playback speed', desc: 'Use the speed controls to listen at 0.5x, 1x, 1.5x or 2x speed.' },
        ].map(({ step, title, desc }) => (
          <div key={step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{step}</div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 15, color: '#6b6b6b' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <H>Accessibility</H>
      <P>We are committed to making Inkwell accessible to everyone. Text to speech is one of several accessibility features we offer. If you have feedback or suggestions, please contact us at accessibility@inkwell.com.</P>
      <H>Supported Languages</H>
      <P>Text to speech currently supports English. We are actively working on adding support for more languages including Tamil, Hindi, Spanish and French.</P>
    </PageLayout>
  );
}