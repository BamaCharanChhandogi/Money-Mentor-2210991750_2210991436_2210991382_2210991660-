import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    setSubmitted(true);
    setTimeout(() => {
      setForm({
        name: '',
        email: '',
        message: '',
      });
      setSubmitted(false);
    }, 3000);
  };

 const contactInfo = [
  {
    title: "Email Us",
    icon: Mail,
    value: "support@moneymentor.com",
    description: "We'll respond within 24 hours",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    title: "Call Us",
    icon: Phone,
    value: "+1 (234) 567-890",
    description: "Mon-Fri, 9AM-6PM EST",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    title: "Visit Us",
    icon: MapPin,
    value: "123 Finance Street",
    description: "New York, NY 10001",
    gradient: "from-purple-500 to-purple-700",
  },
];

  return (
    <div className="min-h-screen bg-mesh py-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-2xl mb-6">
            <MessageSquare className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="gradient-text-ocean">Get in Touch</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${info.gradient} mb-4 shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{info.title}</h3>
                <p className="text-slate-900 font-semibold mb-1">{info.value}</p>
                <p className="text-sm text-slate-500">{info.description}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                Send us a Message
              </h2>
              <p className="text-slate-600">
                Fill out the form below and we'll get back to you shortly
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-12 scale-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-100 mb-6">
                  <CheckCircle2 className="h-10 w-10 text-success-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600">Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="input-primary"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="input-primary"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="6"
                    className="input-primary resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-4 text-lg shadow-xl shadow-primary-500/20"
                  >
                    <span>Send Message</span>
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What are your support hours?",
                answer: "Our support team is available Monday through Friday, 9AM-6PM EST. We typically respond to all inquiries within 24 hours."
              },
              {
                question: "How secure is my financial data?",
                answer: "We use bank-level 256-bit SSL encryption to protect your data. Your information is never shared with third parties without your consent."
              },
              {
                question: "Can I integrate multiple bank accounts?",
                answer: "Yes! You can connect unlimited bank accounts through our secure Plaid integration for comprehensive financial tracking."
              }
            ].map((faq, index) => (
              <div key={index} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-primary-100 rounded-lg">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
