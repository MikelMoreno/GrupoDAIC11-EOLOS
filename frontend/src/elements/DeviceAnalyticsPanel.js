import React from 'react';

function Chart(props) {
    return (
        <iframe
            src={props.url + "&theme=light"}
            width="450"
            height={200 * props.heightMultiplier}
            frameBorder="0" ></iframe>
    );
}

export default function DeviceAnalyticsPanel(props) {

    // return (
    //     <div>
    //         {props.device.grafana_panels.map(url => {
    //             return (
    //                 <iframe
    //                     src={url + "&theme=light"}
    //                     width="450"
    //                     height="200"
    //                     frameBorder="0" ></iframe>
    //             );
    //         })}
    //     </div>
    // );

    let panels_urls = props.device.grafana_panels;
    let charts = panels_urls.map((url, index) => <Chart url={url} heightMultiplier={index > 2 && index < 5 ? 1.5 : 1}/>);

    return <div>{charts}</div>;


}