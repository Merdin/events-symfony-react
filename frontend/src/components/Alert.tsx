import React from "react";
import {Alert} from "react-bootstrap";
import {Variant} from "react-bootstrap/types";

interface AlertBannerProps {
    alert: { message: string, variant: Variant };
    onClose: () => void;
}

export default function({ alert, onClose }: AlertBannerProps) {
    return (
        <>
            <Alert key={alert.variant} variant={alert.variant} onClose={onClose}>
                { alert.message }
            </Alert>
        </>
    );
};
