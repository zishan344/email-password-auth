import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./App.css";
import app from "./firebase.init";
const auth = getAuth(app);
function App() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState("");
  console.log(registered);
  const handaleEmailBlur = (e) => {
    setEmail(e.target.value);
  };
  const handalePasswordBlur = (e) => {
    setPassword(e.target.value);
  };
  const handaleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("password Should at Least one special caraectar");
      return;
    }

    setValidated(true);
    setError("");
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPassword("");
          veryfyEmail();
        })
        .catch((error) => {
          setError(error.message);
        });
    }

    e.preventDefault();
  };

  const veryfyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("email verification send");
    });
  };
  const handaleForgetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("email send");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handaleRigistaredChange = (e) => {
    setRegistered(e.target.checked);
  };

  return (
    <div>
      <h2 className="text-primary mt-3 text-center ">
        Please {registered ? "login" : "Registered"} this site
      </h2>
      <Form
        noValidate
        validated={validated}
        onSubmit={handaleSubmit}
        className="mx-auto w-50 "
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onBlur={handaleEmailBlur}
            type="email"
            placeholder="Enter email"
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onBlur={handalePasswordBlur}
            type="password"
            placeholder="Password"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>

        <p className="text-danger">{error}</p>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            onChange={handaleRigistaredChange}
            type="checkbox"
            label="Already registered?"
          />
        </Form.Group>
        <Button onClick={handaleForgetPassword} variant="link">
          Forget Password
        </Button>
        <Button variant="primary" type="submit">
          {registered ? "Login" : "Registered"}
        </Button>
      </Form>
    </div>
  );
}

export default App;
