import './index.css'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const EntryForm = ({handleSubmit}) => (
  <form className="form" onSubmit={handleSubmit}>
    <input type='text' name='content' required />
    <button type='submit'>Submit</button>
  </form>
)

class EntryList extends Component {
  state = {
    entries: {},
    error: false,
    loading: true
  }

  componentDidMount () {
    axios.get('/api/entries')
      .then(res => res.data)
      .then(entries => {
        this.setState({
          loading: false,
          entries: entries.reduce((dict, entry) => {
            dict[entry.id] = entry
            return dict
          }, {})
        })
      })
      .catch(error => {
        this.setState({
          loading: false,
          error
        })
      })
  }

  upvote = id => () => {
    axios.put(`/api/entries/${id}`)
      .then(res => res.data)
      .then(entry => {
        this.setState({
          entries: {
            ...this.state.entries,
            [entry.id]: entry
          }
        })
      })
      .catch(error => {
        this.setState({error})
      })
  }

  addNew = (evt) => {
    evt.preventDefault()
    const content = evt.target.content.value
    axios.post('/api/entries', {content})
      .then(res => res.data)
      .then(entry => {
        this.setState({
          entries: {
            ...this.state.entries,
            [entry.id]: entry
          }
        })
      })
      .catch(error => {
        this.setState({error})
      })
  }

  render () {
    const {entries, loading, error} = this.state

    if (loading) return <div>Loading</div>
    if (error) return <div>{error.message}</div>
    return (
      <div>
        <ul>
          {
            Object.values(entries).map(entry => (
              <li className="list" key={entry.id}>
                <a className="upvote" onClick={this.upvote(entry.id)}>
                  <span>{entry.votes}</span>
                </a>
                <span className="content">{entry.content}</span>
              </li>
            ))
          }
        </ul>
        <EntryForm handleSubmit={this.addNew} />
      </div>
    )
  }
}

ReactDOM.render(
  <div>
    <EntryList />
  </div>,
  document.getElementById('app')
)
