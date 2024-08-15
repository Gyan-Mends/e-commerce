// app/routes/login.tsx

import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return json({ error: data.message || "Login failed" }, { status: 401 });
    }

    const data = await response.json();
    // Store the token in local storage or session (if needed)
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": `token=${data.token}; HttpOnly; Path=/;`,
      },
    });
  } catch (error) {
    return json({ error: "An error occurred during login. Please try again." }, { status: 500 });
  }
};

export default function Login() {
  const actionData = useActionData();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <div>
          <label>
            Username: <input type="text" name="username" required />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" required />
          </label>
        </div>
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
