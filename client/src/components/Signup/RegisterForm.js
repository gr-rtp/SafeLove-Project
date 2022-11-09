import React, { useState } from "react";
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Register.css';


function RegisterForm() {

    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        surname: "",
        dob: "",
        gender: "",
        postcode: "",
        vaxx_status: "",
        int_gender: "",
        int_vaxx_status: "",
        interests: "",
        url: "",
    })

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try { 
            const response = await axios.put('/auth/register', {formData})
            
            const success = response.status === 200

            if (success) {
                console.log(response.data.first_name + " has been registered successfully!")
                navigate ('/dashboard')
            }

        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        console.log('e', e)
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))

    }

    return (
            <div className="register">
                <form onSubmit={handleSubmit}>
                    <section>
                        <div className="form-inner">
                            <h1>Register</h1>

                            <div className="form-group">
                                <label htmlFor="first_name">First Name:</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    required={true}
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />        
                            </div>

                            <div className="form-group">
                                <label htmlFor="surname">Surname:</label>
                                <input
                                    type="text"
                                    name="surname"
                                    id="surname"
                                    required={true}
                                    value={formData.surname}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dob">Date of Birth:</label>
                                <input
                                    id="dob"
                                    type="date"
                                    name="dob"
                                    placeholder="YYYY-MM-DD"
                                    required={true}
                                    value={formData.dob}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">Gender:</label>
                                    <div className="multiple-input-container">
                                        <input
                                            id="man_gender"
                                            type="radio"
                                            name="gender"
                                            value="Man"
                                            required={true}
                                            onChange={handleChange}
                                            checked={formData.gender === "Man"}
                                        />
                                        <label htmlFor="man_gender">Man</label>
                                        <input
                                            id="woman_gender"
                                            type="radio"
                                            name="gender"
                                            value="Woman"
                                            required={true}
                                            onChange={handleChange}
                                            checked={formData.gender === "Woman"}
                                        />
                                        <label htmlFor="woman_gender">Woman</label>
                                        <input
                                            id="lgbt_gender"
                                            type="radio"
                                            name="gender"
                                            value="LGBT"
                                            required={true}
                                            onChange={handleChange}
                                            checked={formData.gender === "LGBT"}
                                        />
                                        <label htmlFor="lgbt_gender">LGBT+</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="int_gender">Looking for:</label>
                                    <div className="multiple-input-container">
                                        <input
                                            id="int_gender_man"
                                            type="radio"
                                            name="int_gender"
                                            value="Man"
                                            required={true}
                                            onChange={handleChange}
                                            checked={formData.int_gender === "Man"}
                                        />
                                        <label htmlFor="int_gender_man">Man</label>
                                        <input
                                            id="int_gender_woman"
                                            type="radio"
                                            name="int_gender"
                                            value="Woman"
                                            required={true}
                                            onChange={handleChange}
                                            checked={formData.int_gender === "Woman"}
                                        />
                                        <label htmlFor="int_gender_woman">Woman</label>
                                        <input
                                            id="int_gender_lgbt"
                                            type="radio"
                                            name="int_gender"
                                            value="LGBT"
                                            required={true}
                                            onChange={handleChange}
                                            checked={formData.int_gender === "LGBT"}
                                        />
                                        <label htmlFor="int_gender_lgbt">LGBT+</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="postcode">Postcode:</label>
                                <input
                                    id="postcode"
                                    type="number"
                                    name="postcode"
                                    required={true}
                                    value={formData.postcode}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="vaxx_status">Vaccination status:</label>
                                    <div className="multiple-input-container">
                                        <input
                                            id="vaccinated"
                                            type="radio"
                                            name="vaxx_status"
                                            required={true}
                                            value="Vaccinated"
                                            onChange={handleChange}
                                            checked={formData.vaxx_status === "Vaccinated"}
                                        />
                                        <label htmlFor="vaccinated">Vaccinated</label>
                                        <input
                                            id="unvaccinated"
                                            type="radio"
                                            name="vaxx_status"
                                            required={true}
                                            value="Unvaccinated"
                                            onChange={handleChange}
                                            checked={formData.vaxx_status === "Unvaccinated"}
                                        />
                                        <label htmlFor="unvaccinated">Unvaccinated</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="int_vaxx_status">I'd like to date someone who is:</label>
                                    <div className="multiple-input-container">
                                        <input
                                            id="vaccinated_interested"
                                            type="radio"
                                            name="int_vaxx_status"
                                            required={true}
                                            value="Vaccinated"
                                            onChange={handleChange}
                                            checked={formData.int_vaxx_status === "Vaccinated"}
                                        />
                                        <label htmlFor="vaccinated_interested">Vaccinated</label>
                                        <input
                                            id="unvaccinated_interested"
                                            type="radio"
                                            name="int_vaxx_status"
                                            required={true}
                                            value="Unvaccinated"
                                            onChange={handleChange}
                                            checked={formData.int_vaxx_status === "Unvaccinated"}
                                        />
                                        <label htmlFor="unvaccinated_interested">Unvaccinated</label>
                                        <input
                                            id="any_status_interested"
                                            type="radio"
                                            name="int_vaxx_status"
                                            required={true}
                                            value="Any"
                                            onChange={handleChange}
                                            checked={formData.int_vaxx_status === "Any"}
                                        />
                                        <label htmlFor="any_status_interested">Any</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="interest">Interests:</label>
                                <input
                                    id="interests" 
                                    type="text"
                                    name="interests"
                                    required={true}
                                    value={formData.interests}
                                    onChange={handleChange}
                                />
                            </div>


                            <input type="submit" value="SUBMIT" />
                        </div>
                    </section>

                    <section>
                        <div className="profile">
                            <label htmlFor="url"> Upload Profile Photo </label>
                            <br></br>
                            <input
                                type="url"
                                name="url"
                                id="url"
                                placeholder="url link"
                                required={true}
                                onChange={handleChange}
                            />
                            <div className="photo-container">
                                {formData.url && <img src={formData.url} alt="profile pic preview"/>} 
                            </div>
                        </div>
                    </section>
                </form>
            </div>
    )
}

export default RegisterForm