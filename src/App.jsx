import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

import { RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage";

function App() {

  return (

    <Container className="vh-100 px-0" fluid={true}>
      <Routes>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/" element={<HomePage />} />

        </Routes>

    </Container>
  );
}

export default App;
