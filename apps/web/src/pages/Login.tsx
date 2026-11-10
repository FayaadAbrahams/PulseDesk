import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { ComponentProps } from "react";
import { Form, Link, useNavigation } from "react-router";

type LoginFormProps = ComponentProps<"div"> & { error?: string };

const LoginForm = ({ className, error, ...props }: LoginFormProps) => {
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <h1 className="text-3xl">Login</h1>
              <CardTitle>Use your email and password to login.</CardTitle>
              <CardDescription>Let's get to the ticket show.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Posts to the route's server action, so it also works before JavaScript loads. */}
              <Form method="post">
                <FieldGroup>
                  {error && <FieldError>{error}</FieldError>}
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="danwhoa@example.com"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Logging in…" : "Login"}
                    </Button>
                    <Button variant="outline" type="button">
                      Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account?{" "}
                      <Link to="/register">Sign up</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
