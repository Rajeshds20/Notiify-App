import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Error() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/");
    }, [navigate]);

    return (
        <h2>Page Not Found</h2>
    );
}

export default Error;