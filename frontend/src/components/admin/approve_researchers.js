import React from "react";
import { useState, useEffect } from "react";

const ADMIN_APPROVE_RESEARCHERS = () => {

    
    const editProfileVisible = false;
    const [userList, setuserList] = useState([]);
    const [userSpentList, setuserSpentList] = useState([]);
    const [permitList, setPermitList] = useState([]);

    const getUsers = async () => {

        try {
            const response = await fetch(`http://localhost:5000/researcher/get-Not-Verified`, {
                method: "GET",
                headers: { token: localStorage.token }

            });
            const jsonData = await response.json();

            setuserList(jsonData);
        }
        catch (error) {
            console.error(error.message);
        }
    };



    const deleteUser = async (email) => {
        try {
            const deleteUser = await fetch(`http://localhost:5000/researcher/delete/${email}`, {
                method: "DELETE"
            });

            getUsers();
            setuserList(userList.filter(user => user.email !== email));
        } catch (error) {
            console.error(error.message);
        }
    };


    const getAllPermits = async () => {
        let temp = [];
        for (let i = 0; i < userList.length; i++) {
            try {
                const response = await fetch(`http://localhost:5000/researcher/getPermit/${userList[i].email}`, {
                    method: "GET",
                    headers: { token: localStorage.token }
                });
                const jsonData = await response.json();
                temp.push(jsonData);
            } catch (error) {
                console.error(error.message);
            }
        }
        setPermitList(temp);
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        getAllPermits();
    }, [userList]);

    
    return (
        <div className="ADMIN_APPROVE_RESEARCHERS">
            <div style={{ marginTop: '115px' }}></div>
            <h2 className="text-center mt-5"><u> All Verified Researchers</u></h2>
            <table className="table mt-5 text-center">
                <thead>
                    <tr>
                        <th>Profile Picture</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>


                {userList.map((user, index) => (
                        <tr key={user.researcher_id}>
                            <td><img src={user.image} alt="User Icon" style={{ width: 'auto', height: '60px', marginLeft: '10px' }} /></td>
                            <td>{user.researcher_name}</td>
                            <td>{user.email}</td>
                            <td>{userSpentList[index] ? '\u09F3' + userSpentList[index] : '\u09F3' + 0}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteUser(user.email)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                    
            <br />
            <br />
            <button className="btn btn-warning" onClick={() => {

                localStorage.removeItem("token");
                window.location.href = "/";
            }

            }> Return to home page </button>

        </div>
    );
};

export default ADMIN_APPROVE_RESEARCHERS;