import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, ArrowRight } from "lucide-react";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Support ticket sent! We'll get back to you soon.",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Layout>
      <div className="w-full flex justify-center py-20 px-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="bg-card p-14 rounded-3xl w-full max-w-[640px] shadow-[0_25px_60px_rgba(0,0,0,0.08)] text-center">
          <div className="inline-block bg-primary/10 text-primary text-[13px] font-semibold px-[18px] py-2 rounded-full mb-3.5">
            Contact Us
          </div>
          <h1 className="text-[40px] font-bold text-foreground my-3.5 tracking-[-0.5px]">
            Let's Get In Touch
          </h1>
          <p className="text-muted-foreground text-base mb-10">
            Or email us directly at{" "}
            <a href="mailto:support@nextravel.ai" className="text-primary no-underline hover:underline">
              support@nextravel.ai
            </a>
          </p>

          <form onSubmit={handleSubmit} className="text-left">
            <label className="text-[15px] font-semibold mb-2 block text-foreground">
              Full Name
            </label>
            <div className="flex items-center border border-primary/20 rounded-full px-[18px] py-3 mb-[22px] bg-card transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <User className="w-4 h-4 text-muted-foreground mr-2.5" />
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-none outline-none shadow-none p-0 h-auto text-base bg-transparent focus-visible:ring-0"
              />
            </div>

            <label className="text-[15px] font-semibold mb-2 block text-foreground">
              Email Address
            </label>
            <div className="flex items-center border border-primary/20 rounded-full px-[18px] py-3 mb-[22px] bg-card transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <Mail className="w-4 h-4 text-muted-foreground mr-2.5" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-none outline-none shadow-none p-0 h-auto text-base bg-transparent focus-visible:ring-0"
              />
            </div>

            <label className="text-[15px] font-semibold mb-2 block text-foreground">
              Message
            </label>
            <Textarea
              placeholder="Describe your issue..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full border border-primary/20 rounded-2xl px-[14px] py-3.5 resize-none text-base mb-[26px] transition-all duration-200 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.15)] focus-visible:ring-0"
            />

            <button
              type="submit"
              className="w-full h-[54px] border-none rounded-full bg-primary text-primary-foreground text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Send Message
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
