"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Only numbers allowed")
    .min(10, "Must be at least 10 digits")
    .required("Phone number is required"),
  message: Yup.string().required("Message is required"),
  agree: Yup.boolean().oneOf([true], "You must accept the privacy policy"),
});

const ContactModal = ({ isOpen, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* SIDE MODAL */}
      <div
        className={` fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 p-6`}
      >
        {/* MODAL CONTENT */}
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <button className="self-end text-xl font-bold" onClick={onClose}>
            ✖
          </button>

          {/* Header */}
          <div className="text-center mt-2">
            <h2 className="text-sm text-[#2872AF]">Contact Us</h2>
            <p className="text-3xl text-[#101828]">Get in touch</p>
            <p className="text-[#667085] text-sm mb-4">
              We love to hear from you. Please fill out this form.
            </p>
          </div>
          
          {/* Success Message */}
          <div className="overflow-auto scrollbar-hide">
            {isSubmitted ? (
              <div className=" text-green-600 text-center font-semibold text-lg mt-4">
                ✅ Your message has been sent successfully!
              </div>
            ) : (
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  message: "",
                  agree: false,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  console.log("Form Data:", values);
                  setSubmitting(false);
                  setIsSubmitted(true);
                  setTimeout(() => {
                    setIsSubmitted(false);
                    onClose();
                  }, 3000);
                }}
              >
                {({ isValid, isSubmitting }) => (
                  <Form className="flex flex-col gap-4 mt-6">
                    {/* Input Fields */}
                    {[
                      { name: "firstName", label: "First Name", type: "text" },
                      { name: "lastName", label: "Last Name", type: "text" },
                      { name: "email", label: "Email", type: "email" },
                      { name: "phone", label: "Phone Number", type: "text" },
                    ].map(({ name, label, type }) => (
                      <div key={name} className="flex flex-col gap-2">
                        <label className="text-sm font-medium">{label}</label>
                        <Field
                          type={type}
                          name={name}
                          placeholder={`Enter your ${label.toLowerCase()}`}
                          className="w-full border border-gray-300 px-3 py-3 text-sm rounded-md focus:ring-0 focus:outline-none"
                        />
                        <ErrorMessage
                          name={name}
                          component="p"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    ))}

                    {/* Message Field */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Message</label>
                      <Field
                        as="textarea"
                        name="message"
                        placeholder="Include a message..."
                        className="w-full border border-gray-300 px-3 py-3 text-sm h-20 rounded-md focus:ring-0 focus:outline-none"
                      />
                      <ErrorMessage
                        name="message"
                        component="p"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Privacy Policy Checkbox */}
                    <div className="flex items-center gap-2">
                      <Field type="checkbox" name="agree" className="w-4 h-4" />
                      <label className="text-sm text-gray-600">
                        You agree to our friendly{" "}
                        <a href="#" className="text-blue-500">
                          privacy policy
                        </a>
                        .
                      </label>
                    </div>
                    <ErrorMessage
                      name="agree"
                      component="p"
                      className="text-red-500 text-xs"
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className={`w-full px-4 py-3 text-sm rounded-md transition mb-6 ${
                        isValid
                          ? "bg-[#2872AF] text-white hover:bg-[#1e5b88]"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      disabled={!isValid || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Send Message"}
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactModal;
