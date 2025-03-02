import React from "react";
import "./style.css";
import "../../components/cube/style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
  services,
} from "../../content_option";
import html from "../../assets/images/html.svg";
import css from "../../assets/images/tailwind.svg";
import js from "../../assets/images/js.svg";
import node from "../../assets/images/nodejs.svg";
import react from "../../assets/images/react.svg";
import jqeury from "../../assets/images/jqeury.svg";

export const About = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> About | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">About me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">{dataabout.title}</h3>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <div>
              <p>{dataabout.aboutme}</p>
            </div>
          </Col>
        </Row>
        <Row className=" sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Work Timline</h3>
          </Col>
          <Col lg="7">
            <table className="table caption-top">
              <tbody>
                {worktimeline.map((data, i) => {
                  return (
                    <tr key={i}>
                      <th scope="row">{data.jobtitle}</th>
                      <td>{data.where}</td>
                      <td>{data.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Skills</h3>
          </Col>
          <Col lg="7">
            {skills.map((data, i) => {
              return (
                <div key={i}>
                  <h3 className="progress-title">{data.name}</h3>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${data.value}%`,
                      }}
                    >
                      <div className="progress-value">{data.value}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lang="5">
            <h3 className="color_sec py-4">Services</h3>
          </Col>
          <Col lg="7">
            {services.map((data, i) => {
              return (
                <div className="service_ py-4" key={i}>
                  <h5 className="service__title">{data.title}</h5>
                  <p className="service_desc">{data.description}</p>
                </div>
              );
            })}
          </Col>
        </Row>
      </Container>
      <div class="cube">

        <div class="outer-cube">
          <div class="outer-top">
            <img src={node} />
          </div>
          <div class="outer-bottom">
            <img src={js} />
          </div>
          <div class="outer-front">
            <img src={react} />
          </div>
          <div class="outer-back">
            <img src={css} />
          </div>
          <div class="outer-left">
            <img src={jqeury} />
          </div>
          <div class="outer-right">
            <img src={html} />
          </div>
        </div>
        <div class="inner-cube">
          <div class="inner-top">
            <img src={node} />
          </div>
          <div class="inner-bottom">
            <img src={js} />
          </div>
          <div class="inner-front">
            <img src={react} />
          </div>
          <div class="inner-back">
            <img src={css} />
          </div>
          <div class="inner-left">
            <img src={jqeury} />
          </div>
          <div class="inner-right">
            <img src={html} />
          </div>
        </div>
      </div>
      <div>
        <div class="message">
          <div class="tip">
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};
