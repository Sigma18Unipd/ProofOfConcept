import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router";
import axios from "axios";



const formSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email cannot be empty"),
  password: z.string({
    required_error: "Password is required",
  }).nonempty("Password cannot be empty"),
})



function onSubmit(values: z.infer<typeof formSchema>) {
  axios.post('http://localhost:5000/login', values)
    .then(response => {
      if (response.status !== 200) {
        throw new Error("Login failed");
      }
      document.cookie = "authToken=" + response.data.authToken;
      window.location.href = "/dashboard";
    })
    .catch(error => {
      console.error("Login failed:", error);
    });
}



export default function Login() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Insert your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Insert your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={()=>{navigate('/register')}}>Register</Button> 
              <Button type="submit">Login</Button> 
            </div>
          </form>
        </Form>  
        </CardContent>
      </Card>
    </div>
  );
}
