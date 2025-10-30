"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  BarChart3,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Target,
  Award,
} from "lucide-react"
import Link from "next/link"

export function BusinessContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container max-w-6xl relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-sm px-4 py-1">
              Adopour for Enterprise
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              Build authentic communities around your brand
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed text-balance">
              Empower your organization to connect with customers, build brand loyalty, and drive engagement through
              meaningful community interactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Contact Sales
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 bg-transparent"
                asChild
              >
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {[
              { value: "10M+", label: "Active Users" },
              { value: "500+", label: "Enterprise Clients" },
              { value: "98%", label: "Customer Satisfaction" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Enterprise-grade features for modern brands</h2>
            <p className="text-lg text-slate-600">
              Everything you need to build, manage, and scale your brand community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "Branded Communities",
                description: "Create custom-branded spaces that reflect your company's identity and values",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track engagement, sentiment, and ROI with comprehensive analytics dashboards",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level security with SSO, 2FA, and compliance certifications",
              },
              {
                icon: Users,
                title: "Team Management",
                description: "Manage multiple team members with role-based access controls",
              },
              {
                icon: Zap,
                title: "API Integration",
                description: "Seamlessly integrate with your existing tools and workflows",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Multi-language support and CDN delivery for worldwide audiences",
              },
            ].map((feature, i) => (
              <Card key={i} className="border-2 hover:border-cyan-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by leading brands worldwide</h2>
            <p className="text-lg text-slate-600">
              See how companies use Adopour to transform their customer relationships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Customer Support",
                description:
                  "Build self-service communities where customers help each other, reducing support costs by 40%",
                metric: "40% cost reduction",
              },
              {
                icon: Target,
                title: "Product Feedback",
                description: "Gather insights directly from your community to inform product development and roadmap",
                metric: "3x faster iteration",
              },
              {
                icon: Award,
                title: "Brand Advocacy",
                description: "Turn customers into brand ambassadors who actively promote and defend your products",
                metric: "5x engagement boost",
              },
            ].map((useCase, i) => (
              <Card key={i} className="border-2">
                <CardContent className="pt-6">
                  <div className="p-3 bg-slate-100 rounded-lg w-fit mb-4">
                    <useCase.icon className="h-6 w-6 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{useCase.description}</p>
                  <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">{useCase.metric}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="container max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$299",
                description: "Perfect for small businesses getting started",
                features: ["Up to 1,000 members", "Basic analytics", "Email support", "Custom branding", "API access"],
              },
              {
                name: "Professional",
                price: "$799",
                description: "For growing businesses with advanced needs",
                features: [
                  "Up to 10,000 members",
                  "Advanced analytics",
                  "Priority support",
                  "Custom branding",
                  "API access",
                  "SSO integration",
                  "Dedicated account manager",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with specific requirements",
                features: [
                  "Unlimited members",
                  "Enterprise analytics",
                  "24/7 phone support",
                  "White-label solution",
                  "Custom integrations",
                  "SLA guarantee",
                  "Dedicated success team",
                ],
              },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`border-2 relative ${plan.popular ? "border-cyan-500 shadow-xl scale-105" : "border-slate-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-slate-600">/month</span>}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">{plan.description}</p>
                  <Button
                    className={`w-full mb-6 ${plan.popular ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-slate-600">
              Contact our sales team to learn how Adopour can transform your business
            </p>
          </div>

          {submitted ? (
            <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
              <CardContent className="py-12 text-center">
                <div className="p-4 bg-cyan-500 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank you for your interest!</h3>
                <p className="text-slate-600">Our sales team will contact you within 24 hours.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      placeholder="Acme Inc."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us about your needs</Label>
                    <Textarea
                      id="message"
                      placeholder="What are you looking to achieve with Adopour?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Contact Sales"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Join thousands of businesses building communities on Adopour</h2>
          <p className="text-slate-300 mb-8">Start your free trial today, no credit card required</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
              <Link href="/auth/sign-up">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/feed">View Platform</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
