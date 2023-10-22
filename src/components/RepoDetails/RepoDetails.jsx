import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ReactModal from 'react-modal';
import { getDateRangeForWeeks } from "../../utils/dateRanges";
import Buttons from "../Buttons/Buttons";
import sortIcon from "../../assets/sort.png"
import closeIcon from "../../assets/close-icon.png"
import "../../styles/repoDetails.css"

function RepoDetails(props) {
  const getOwner = props.repo.full_name.split("/")[0];
  const getRepo = props.repo.full_name.split("/")[1];
  const [issues, setIssues] = useState([]);
  const [openIssues, setOpenIssues] = useState([]);
  const [closedIssues, setClosedIssues] = useState([]);
  const [loading, setLoading] = useState(0);
  const [weeklyIssuesArr, setWeeklyIssuesArr] = useState([]);
  const [sortOrder, setSortOrder] = useState(false);


  const weeksCount = 10
  const dateRanges = useMemo(() => getDateRangeForWeeks(weeksCount), [weeksCount]);

  const cutOffDate = dateRanges[dateRanges.length - 1].start.toISOString()  
  
  const getAllIssues = async () => {
      try {
      const issuesPerPage = 100;
      let page = 1;
      let allIssues = [];

      while (true) {
        setLoading(1)
        const response = await axios.get(
            `https://api.github.com/repos/${getOwner}/${getRepo}/issues?state=all&per_page=${issuesPerPage}&page=${page}&since=${cutOffDate}`,
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          }
        );
        
        if (response.data.length === 0) {
          setLoading(2)
          break; // No more issues to fetch
        }

        allIssues = allIssues.concat(response.data);

        page++;
      }

      // All Issues:  
      setIssues(allIssues.filter(item => item.state && !item.pull_request))
      // Filter open and closed issues
      const openIssues = allIssues.filter(
        (item) => item.state === "open" && !item.pull_request
      );
      const closedIssues = allIssues.filter(
        (item) => item.state === "closed" && !item.pull_request
      );
      
      setOpenIssues(openIssues);
      setClosedIssues(closedIssues);
      props.setShowBtn(true);

    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(3)
    }
  }

  const handleCloseModal = () => {
    props?.setShowModal(false)
  }

  const handleSortToggle = () => {
    setSortOrder(!sortOrder);
  }

  useEffect(() => {
    getAllIssues();
    setIssues([]);
    setOpenIssues([]);
    setClosedIssues([]);
    setLoading(0);
    props.setShowBtn(false);
    // setWeeklyIssuesArr([]);
  }, [getOwner, getRepo]);

  useEffect(() => {
    const weeklyIssues = [];
    for(let i = 0; i<dateRanges.length; i++){
          let weekIssueCount = issues.filter(item => new Date(item.created_at) >= new Date(dateRanges[i]?.start) && new Date(item.created_at) <= new Date(dateRanges[i]?.end));
          weeklyIssues.push(weekIssueCount);
     }
     setWeeklyIssuesArr(weeklyIssues);
  }, [issues])

 return (
    <>
        {
            loading === 1?
            <div className="spinner-border m-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            :
            loading === 2?
            <>
            <div className="d-flex flex-row mb-3 flex-wrap m-2">
              <div className="card p-3 info-container m-2">
                <p className="list-group-item">All Issues: <b> {issues.length} </b>  </p>
                <p className="list-group-item">Open Issues: <b> {openIssues.length} </b> </p>
                <p className="list-group-item">Closed Issues: <b> {closedIssues.length} </b> </p>
                <hr/>
                <small>Last 10 Weeks Issues Data:</small>
                <p>{weeklyIssuesArr.map((item, index) => {
                  return(
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between">
                        <div>
                          Number of issues in, Week {index+1} <br/> {`(${new Date(dateRanges[index].start).toDateString()} - ${new Date(dateRanges[index].end).toDateString()})`}: 
                        </div>
                        <div>
                         <b> {item.length} </b>
                        </div>
                      </li>
                    </ul>
                  )
                })}</p>
              </div>
              <div style={{height:"450px"}} className="card p-3 info-container m-2">
                <Buttons owner={getOwner} issues={issues}  cutOffDate={cutOffDate} repo={getRepo} btnArr={dateRanges} />
              </div>
            </div>
            {
              props?.showModal && issues.length >0 ?  
              <ReactModal 
              isOpen={props.showModal}
              contentLabel="Minimal Modal Example"
              >
              <img id="modal-close-btn" src={closeIcon} onClick={handleCloseModal}/>
              <div style={{height:"30px"}}></div>
              <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                  <span className="navbar-brand mb-0 h1">Issues:</span>
                </div>
              </nav>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">State</th>
                    <th scope="col">Issue URL</th>
                    <th scope="col">Created On <img style={{cursor:"pointer"}} onClick={handleSortToggle} src={sortIcon} /> </th>
                  </tr>
                </thead>
                <tbody>
                  {issues.sort((a,b) => sortOrder ? ( new Date(a.created_at) - new Date(b.created_at) ) : ( new Date(b.created_at) - new Date(a.created_at) ) ).map(item => {
                    return(
                      <tr>
                        <td>{item.id}</td>
                        <td style={{wordBreak:"initial", wordWrap:"break-word", minWidth:"200px", maxWidth:"350px"}}>{item.title}</td>
                        <td> {item.state === "open" ? <span style={{color:"yellowgreen"}}>open</span> : <span style={{color:"red"}}>closed</span> } </td>
                        <td> <a href={item.url} target="_blank"> Visit</a> </td>
                        <td> {new Date(item.created_at).toLocaleDateString()} </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
             </ReactModal>
             :
             <ReactModal 
              isOpen={props.showModal}
              contentLabel="Minimal Modal Example"
              >
                <img id="modal-close-btn" src={closeIcon} onClick={handleCloseModal}/>
                <div style={{height:"30px"}}></div>
                <h2>Nothing to show</h2>
             </ReactModal>
            }
            </>
            :
            loading === 3 &&
            <p>Error. Please try again</p>
        }
    </>
  );
}

export default RepoDetails;
