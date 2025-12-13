import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("Technical Issue");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Our support team will get back to you soon!",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Layout>
      <div className="hero-container">
        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Support</h1>
        <p className="text-secondary mb-8">We are here to help you 24/7.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-3 border-2 border-border rounded-lg"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border-2 border-border rounded-lg"
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="issue-type">Issue Type</label>
            <select
              id="issue-type"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-3 py-3 border-2 border-border rounded-lg bg-card text-foreground"
            >
              <option>Technical Issue</option>
              <option>Billing Question</option>
              <option>Itinerary Feedback</option>
              <option>Other</option>
            </select>
          </div>
          
          <div className="input-group mt-4">
            <label htmlFor="message">Message</label>
            <Textarea
              id="message"
              placeholder="Describe your issue..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-3 border-2 border-border rounded-lg resize-none"
            />
          </div>
          
          <button type="submit" className="confirm-btn">SUBMIT TICKET</button>
        </form>
      </div>
    </Layout>
  );
};

export default Support;
