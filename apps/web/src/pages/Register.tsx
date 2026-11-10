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
import { Link, useSubmit } from "react-router";
import { ComponentProps, useEffect } from "react";

type SignupFormProps = ComponentProps<typeof Card> & { error?: string };

const SignupForm = ({ error, ...props }: SignupFormProps) => {
  const submit = useSubmit();

  // Errors come back from the route's server action (e.g. "Email already in use.").
  useEffect(() => {
    if (!error) return;
    if (error === "Email already in use.") {
      toast.info(error, {
        description: "Login or reset your password!",
        position: "top-center",
      });
    } else {
      toast.error(error, { position: "top-center" });
    }
  }, [error]);

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Validated in the browser, then posted to the server action; the password is never stored client-side.
  function onSubmit(data: z.infer<typeof RegisterSchema>) {
    void submit(
      { name: data.name, email: data.email, password: data.password },
      { method: "post" },
    );
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
            <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
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
                    <Button type="submit" form="form-register">
                      Create Account
                    </Button>
                    <Button variant="outline" type="button">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        alt="Google Icon"
                      />
                      Continue with Google
                    </Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <Link to="/login">Sign in</Link>
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
