import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import * as z from "zod";
import { RegisterSchema } from "@/validations/register-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";


const SignupForm = ({ ...props }: React.ComponentProps<typeof Card>) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  })

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {
      await auth.registerUser(data.name, data.email, data.password);
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        var message = error.response?.data?.message ?? "Registration failed";

        if (error.response?.data?.message == "Email already in use.") {
          message = error.response?.data?.message;
          toast.info(message, { description: "Login or reset your password!", position: "top-center" });
        } else {
          message = "Registration failed";
          toast.error(message, { description: message, position: "top-center" });
          console.error(error);
        }
      }
    }

  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center py-20 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card {...props}>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="form-register" onSubmit={form.handleSubmit(onSubmit)} >
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-title">
                        Full Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Daniel Jacobs"
                        autoComplete="off"
                        required
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-email">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="danwhoa@example.com"
                        autoComplete="off"
                        required
                        type="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <FieldDescription>
                        We'll use this to contact you. We will not share your
                        email with anyone else.
                      </FieldDescription>
                    </Field>

                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-password">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-password"
                        aria-invalid={fieldState.invalid}
                        placeholder=""
                        autoComplete="off"
                        required
                        type="password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-confirm-password"
                        aria-invalid={fieldState.invalid}
                        placeholder=""
                        autoComplete="off"
                        required
                        type="password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                    </Field>
                  )}
                />
                <FieldGroup>
                  <Field id="form-button-group">
                    <Button type="submit" form="form-register">Create Account</Button>
                    <Button variant="outline" type="button" >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Icon" />
                      Continue with Google
                    </Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <a href="/login">Sign in</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupForm;
