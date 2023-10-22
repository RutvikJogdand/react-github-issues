import React, { useState, useEffect } from "react";
import "../../styles/mainPage.css"

function Buttons(props){

  const [weekStart, setWeekStart] = useState(new Date(props?.btnArr[0].start));
  const [weekEnd, setWeekEnd] = useState(new Date(props?.btnArr[0].end));
  const [weeklyCloseRate, setWeeklyCloseRate] = useState(0);
  const [weeklyCloseRatio, setWeeklyCloseRatio] = useState('');

    const extractWeekIssueData = () => {

      const weekIssues = props?.issues.filter(item => new Date(item.created_at) >= weekStart && new Date(item.created_at) <= weekEnd && !item.pull_request);

      const openIssues = weekIssues.filter(
        (item) => item.state === "open"
      );

      const closedIssues = weekIssues.filter(
        (item) => item.state === "closed"
      );

      const weeklyClosureRate = openIssues.length > 0? (closedIssues.length/openIssues.length) : 0;
      const closedToOpenRatio = openIssues.length > 0? `${closedIssues.length}/${openIssues.length}` : 0
      setWeeklyCloseRate(weeklyClosureRate);
      setWeeklyCloseRatio(closedToOpenRatio);
      
    }

    const calCulateAvgWeeklyClosureRate = () => {
      let avgClosureRate = []
      for(let i = 0; i<=props?.btnArr.length; i++){
        let weekIssueCount = props.issues.filter(item => new Date(item.created_at) >= new Date(props.btnArr[i]?.start) && new Date(item.created_at) <= new Date(props.btnArr[i]?.end) && !item.pull_request);
        const openIssues = weekIssueCount.filter(
          (item) => item.state === "open" && !item.pull_request
        );
  
        const closedIssues = weekIssueCount.filter(
          (item) => item.state === "closed" && !item.pull_request
        );

        const weeklyClosureRate = openIssues.length > 0? (closedIssues.length/openIssues.length) : 0;

        avgClosureRate.push(weeklyClosureRate);
      }

      const sum = avgClosureRate.length > 0? avgClosureRate.reduce((accumulator, currentValue) => accumulator + currentValue) : 0;
      const finalSum = (sum/avgClosureRate.length).toFixed(2)
      if(avgClosureRate.length > 0 ){
        return (finalSum)
      }
      return 0
    }

    const handleSetWeekDates = (start, end) => {
      // console.log('start and end', new Date(start).toISOString(), end);
      setWeekStart(new Date(start));
      setWeekEnd(new Date(end));
    }

    useEffect(() => {
      extractWeekIssueData();
    }, [weekStart,weekEnd]);

    return(
        <>
            <div className="d-flex">
                <ul className="avd-data-info list-group">
                  {props.btnArr.map((item, index) => {
                    return(
                        // <div>
                          <li style={{cursor:"pointer"}} className="list-group-item btn btn-secondary" onClick={() => handleSetWeekDates(item.start, item.end)}> Week {index + 1} </li>
                        // </div>
                      )
                    })}
                </ul>
                <div className="avd-data-info">
                  <ul className="list-group">
                    <li className="p-2 list-group-item">
                    Average Weekly closure rate: <b> {calCulateAvgWeeklyClosureRate()} </b>
                    </li>
                    <li className="p-2 list-group-item">
                      Week's closure rate ( {weekStart.toDateString()} - {weekEnd.toDateString()} ) : <b> {weeklyCloseRate.toFixed(2)} </b>
                    </li>
                    <li className="p-2 list-group-item">
                      Closed Issues/New Issues For Week Of: ( {weekStart.toDateString()} - {weekEnd.toDateString()} ) : <b> {weeklyCloseRatio} </b>
                    </li>
                  </ul>
                </div>
            </div>
        </>
    )
}

export default Buttons