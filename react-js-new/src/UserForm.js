import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import "./userForm.css"; // Import CSS file for styling

const UserForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    roles: [],
    email: "",
  });
  const [userData, setUserData] = useState({});
  const [errors, setErrors] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const rolesOptions = ["Author", "Editor", "Subscriber", "Administrator"];

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    roles: Yup.array()
      .of(Yup.string().required())
      .min(1, "At least one role is required")
      .required("Role is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roles") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prevState) => ({
        ...prevState,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users",
        formData
      );
      console.log("User created successfully:", response.data);
      setUserData(response.data.data);
    } catch (error) {
      if (error.name === "ValidationError") {
        setErrors(
          error.inner.reduce((acc, curr) => {
            acc[curr.path] = curr.message;
            return acc;
          }, {})
        );
      } else {
        console.error("Error creating user:", error);
      }
    }
  };

  const viewUserData = async () => {
    try {
      const loggedInResponse = await axios.get(
        "http://127.0.0.1:8000/api/users/"
      );
      setUserData(loggedInResponse.data);
      console.log("Logged in user details:", loggedInResponse.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/allUsers");
        const users = response.data.data.map((user) => ({
          ...user,
          roles: JSON.parse(user.roles),
        }));
        setAllUsers(users);
        console.log("Logged in user details:", response.data);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };
    loadAllUsers();
  }, [userData]);

  return (
    <div className="user-form-container">
      {" "}
      {/* Apply container class for styling */}
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="roles">Roles:</label>
          <select
            id="roles"
            name="roles"
            multiple
            value={formData.roles}
            onChange={handleChange}
          >
            {rolesOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.roles && <p className="error">{errors.roles}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <button type="submit">Save User</button>
      </form>
      <div className="user-details">
        <p>Added User</p>
        <span>Full Name: {userData?.fullname}</span>
        <br />
        <span>Email: {userData?.email}</span>
        <br />
        <span>
          Roles:{" "}
          {Array.isArray(userData?.roles)
            ? userData?.roles.join(", ")
            : userData?.roles}
        </span>
      </div>
      <div className="all-users">
        <p>All Users</p>
        <table border={1} width={500}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>
                  {Array.isArray(user.roles)
                    ? user.roles.join(", ")
                    : user.roles}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserForm;
