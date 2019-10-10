import React from "react";

class FilteredList extends Component {
  componentDidMount = () => {
    this.setState({ items: this.state.initialItems });
  };

  getInitialState = () => {
    return {
      initialItems: [
        "Apples",
        "Broccoli",
        "Chicken",
        "Duck",
        "Eggs",
        "Fish",
        "Granola",
        "Hash Browns"
      ],
      items: []
    };
  };

  handleSearch = event => {
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item) {
      return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({ items: updatedList });
  };

  render() {
    return (
      <div className="filter-list">
        <form>
          <fieldset className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search"
              onChange={this.handleSearch}
            />
          </fieldset>
        </form>
        <List items={this.state.items} />
      </div>
    );
  }
}

class List extends Component {
  render() {
    return (
      <ul className="list-group">
        {this.props.items.map(function(item) {
          return (
            <li className="list-group-item" data-category={item} key={item}>
              {item}
            </li>
          );
        })}
      </ul>
    );
  }
}

React.render(<FilteredList />, document.getElementById("app"));
