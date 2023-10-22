import React, {useState, useEffect} from "react";
import axios from 'axios';
import { throttle } from 'lodash';
// Components:
import RepoDetails from "../RepoDetails/RepoDetails";
// Styles:
import "./../../styles/mainPage.css"
//Assets:
import githubIcon from "../../assets/github-icon.png";
import infoIcon from "../../assets/info-icon.png";


function MainPage(){

    const [searchQuery, setSearchQuery] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [finalSelectedRepo, setFinalSelectedRepo] = useState({});
    const [repoId, setRepoId] = useState(null);
    const [showBtn, setShowBtn] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const searchGithubRepositories = async (query) => {
        try {
          const response = await axios.get(
            `https://api.github.com/search/repositories?q=${query}&per_page=15`, {
              headers: {
                Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
              }
             }
          );
          setRepositories(response.data.items);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      const throttledSearch = throttle(searchGithubRepositories, 500);
    
      useEffect(() => {
        if (searchQuery) {
          throttledSearch(searchQuery);
        } else {
          setRepositories([]);
        }
      }, [searchQuery]);

      const handleRepoHover = (repoName, repoID) => {
        setSelectedRepo(repoName);
        setRepoId(repoID);
      };

      const handleSelectedRepo = () => {

        const reqRepo = repositories.filter(repo => repo.id === repoId)
        setFinalSelectedRepo(reqRepo[0])

        setSelectedRepo([])
      }

      const handleShowModal = () => {
        setShowModal(true)
      }
    
    return(
        <>
            <nav className="navbar bg-body-tertiary">
              <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">Github Issue Search</span>
              </div>
            </nav>
             <div className="m-4">
              <div className="input-group mb-3 m-2 search-container">
                  <span className="input-group-text" id="basic-addon1"> <img height={25} src={githubIcon} /> </span>
                  <input
                      type="text"
                      placeholder="Search GitHub Repositories"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-control"
                      aria-label="Username" aria-describedby="basic-addon1"
                  />
                  <span className="input-group-text"  data-bs-toggle="tooltip" data-bs-title="Full Repository Name Will Be Displayed Here" >{finalSelectedRepo?.full_name} &nbsp;
                  {repositories.length === 0 && <span> Selected Repository Name Will Be Displayed Here </span>}  &nbsp;
                  {showBtn && <button onClick={handleShowModal} style={{zIndex:"0"}} className="btn btn-secondary">Show All Issues</button>}
                  </span>
              </div>
            {/* <div className="d-flex flex-wrap"> */}
              <div className="card list-container">
                  <div className="card-header">
                    {
                      repositories.length === 0?
                      "Search for github repositories"
                      :
                      "Showing top 15 repositories based on your search (Click To Get Details About Issues)"
                    }
                  </div>
                  <ul className="list-group">
                      {repositories.map((repo) => (
                      <li style={{cursor:"pointer"}} className="list-group-item" key={repo.id} onClick={handleSelectedRepo}  onMouseEnter={() => handleRepoHover(repo?.name, repo?.id)}>
                        {repo.name}
                        <a href={repo.html_url} target="_blank">  <small style={{float:"right"}}> Visit </small> </a> 
                      </li>
                      ))}
                  </ul>
              </div>
                  {
                    finalSelectedRepo && finalSelectedRepo.name &&
                    <RepoDetails setShowModal={setShowModal} showModal={showModal} setShowBtn={setShowBtn} repo={finalSelectedRepo} />
                  }
            {/* </div> */}
            </div>
        </>
    )

};

export default MainPage;