import CustomFormField from "@/components/ui/CustomFormField";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldType } from "@/types/global.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
      // Here you would typically send the form data to your backend
      console.log("Contact form submission:", values);
      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to send message. Please try again.");
    }
  };

  const storeLocations = [
    {
      id: 1,
      name: "Downtown Store",
      address: "123 Main Street, Dhaka 1000",
      phone: "+880 1234-567890",
      email: "downtown@motovibe.com",
      hours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
    },
    {
      id: 2,
      name: "Gulshan Branch",
      address: "456 Gulshan Avenue, Dhaka 1212",
      phone: "+880 1234-567891",
      email: "gulshan@motovibe.com",
      hours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
    },
    {
      id: 3,
      name: "Chittagong Store",
      address: "789 Port Road, Chittagong 4000",
      phone: "+880 1234-567892",
      email: "chittagong@motovibe.com",
      hours: "Mon-Sat: 9AM-8PM, Sun: 10AM-6PM",
    },
  ];

  return (
    <main className="min-h-content bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for any questions about our bikes, services, or
            locations. We're here to help you find the perfect bike for your
            needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form - Left Side */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Send us a Message
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <CustomFormField
                  name="name"
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  type="text"
                  placeholder="John Doe"
                  label="Full Name"
                />

                <CustomFormField
                  name="email"
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  type="email"
                  placeholder="john@example.com"
                  label="Email Address"
                />

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    className="min-h-32 resize-none"
                    {...form.register("message")}
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <SubmitButton
                  className="w-full"
                  isLoading={form.formState.isSubmitting}
                >
                  Send Message
                </SubmitButton>
              </form>
            </Form>
          </div>

          {/* Store Locations - Right Side */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Our Store Locations
            </h2>

            {storeLocations.map((store) => (
              <div key={store.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {store.name}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{store.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <a
                      href={`tel:${store.phone}`}
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      {store.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <a
                      href={`mailto:${store.email}`}
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      {store.email}
                    </a>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{store.hours}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Additional Contact Info */}
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-3">
                Need Immediate Help?
              </h3>
              <p className="text-gray-700 mb-4">
                For urgent inquiries or bike emergencies, call our 24/7 support
                line:
              </p>
              <a
                href="tel:+8801800123456"
                className="text-xl font-semibold text-primary hover:underline"
              >
                +880 1800-123456
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
