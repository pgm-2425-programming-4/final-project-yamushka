import React from 'react';


function TaskFilters({ filters, onChange, onReset }) {

  const handleChange = e => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="task-filter">

      <input
        type="text"
        name="search"
        placeholder="Zoeken..."
        value={filters.search}
        onChange={handleChange}
      />


      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="all">Alle statussen</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="in-review">Ready for Review</option>
        <option value="done">Done</option>
      </select>


      <button onClick={onReset}>Reset</button>
    </div>
  );
}

export default TaskFilters;
