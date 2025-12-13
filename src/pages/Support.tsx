import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
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
      description: "Our support team will get back to you soon!",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Layout>
      <main className="flex justify-center px-5 py-20">
        <div className="bg-white p-14 rounded-3xl w-full max-w-[640px] shadow-[0_25px_60px_rgba(0,0,0,0.08)] text-center">
          <div className="inline-block bg-indigo-50 text-indigo-600 text-sm font-semibold px-5 py-2 rounded-full mb-4">
            Contact Us
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 my-4 tracking-tight">
            Let's Get In Touch
          </h1>
          
          <p className="text-slate-500 text-base mb-10">
            Or email us directly at{" "}
            <a href="mailto:support@nextravel.ai" className="text-indigo-600 hover:underline">
              support@nextravel.ai
            </a>
          </p>

          <form onSubmit={handleSubmit} className="text-left">
            <label className="text-sm font-semibold text-slate-800 mb-2 block">
              Full Name
            </label>
            <div className="flex items-center border border-blue-100 rounded-full px-5 py-3 mb-5 transition-all duration-200 focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <User className="text-slate-500 mr-3 h-4 w-4" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-none outline-none w-full text-base bg-transparent"
              />
            </div>

            <label className="text-sm font-semibold text-slate-800 mb-2 block">
              Email Address
            </label>
            <div className="flex items-center border border-blue-100 rounded-full px-5 py-3 mb-5 transition-all duration-200 focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]">
              <Mail className="text-slate-500 mr-3 h-4 w-4" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-none outline-none w-full text-base bg-transparent"
              />
            </div>

            <label className="text-sm font-semibold text-slate-800 mb-2 block">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Describe your issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full border border-blue-100 rounded-2xl p-4 resize-none text-base outline-none mb-6 transition-all duration-200 focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]"
            />

            <button
              type="submit"
              className="w-full h-14 border-none rounded-full bg-indigo-500 text-white text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Send Message
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default Support;
