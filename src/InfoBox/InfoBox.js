import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases,total, active, isRed, ...props   }) {
    return (
        <Card onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} ${
          isRed && "infoBox--red"
        }`}>
            <CardContent>

                {/* Title*/}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                {/* Today Cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/* Total number of Cases*/}
                <Typography color="textSecondary" className="infoBox__total">{total} Total</Typography>

            </CardContent>

        </Card>
    )
}

export default InfoBox
