import { useState } from 'react';
import { format, getDaysInMonth, startOfMonth, addDays, addMonths, subMonths } from 'date-fns';

function Attendance() {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', dailyWage: 500, attendance: {}, position: 'Software Engineer', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe` },
    
  ]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('calendar');

  const daysInMonth = getDaysInMonth(selectedMonth);
  const firstDayOfMonth = startOfMonth(selectedMonth);

  const dates = Array.from({ length: daysInMonth }, (_, i) => 
    addDays(firstDayOfMonth, i)
  );

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAttendance = (employeeId, date) => {
    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        const dateStr = format(date, 'yyyy-MM-dd');
        const newStatus = !emp.attendance[dateStr];
        showNotification(`Marked ${emp.name} as ${newStatus ? 'present' : 'absent'} for ${format(date, 'dd MMM, yyyy')}`);
        return {
          ...emp,
          attendance: {
            ...emp.attendance,
            [dateStr]: newStatus
          }
        };
      }
      return emp;
    }));
  };

  const calculateSalary = (employee) => {
    const presentDays = Object.values(employee.attendance).filter(present => present).length;
    return presentDays * employee.dailyWage;
  };

  const calculateAttendancePercentage = (employee) => {
    const totalDays = Object.keys(employee.attendance).length;
    if (totalDays === 0) return 0;
    const presentDays = Object.values(employee.attendance).filter(present => present).length;
    return Math.round((presentDays / totalDays) * 100);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'bg-emerald-500';
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    const newDate = new Date(parseInt(year), parseInt(month) - 1);
    setSelectedMonth(newDate);
  };

  const goToPreviousMonth = () => {
    setSelectedMonth(prevDate => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth(prevDate => addMonths(prevDate, 1));
  };

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 mt-6">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl transform transition-all duration-500 ${
          notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        } text-white z-50 animate-bounce`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto p-6">
        <header className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-slate-800 mb-3 animate-fade-in">
            Attendance Dashboard
          </h1>
          <p className="text-slate-600 text-lg">Streamlined attendance tracking and employee management</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <svg
                  className="w-5 h-5 text-slate-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-white rounded-lg transition-all duration-200 text-slate-600 hover:text-blue-600"
                  title="Previous Month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={goToToday}
                  className="px-3 py-1 hover:bg-white rounded-lg transition-all duration-200 text-slate-600 hover:text-blue-600 text-sm font-medium"
                >
                  Today
                </button>

                <input
                  type="month"
                  value={format(selectedMonth, 'yyyy-MM')}
                  onChange={handleMonthChange}
                  className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-white rounded-lg transition-all duration-200 text-slate-600 hover:text-blue-600"
                  title="Next Month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'calendar' ? 'bg-white shadow-md text-blue-600' : 'text-slate-600'
                  }`}
                >
                  Calendar View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-slate-600'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{showAddForm ? 'Cancel' : 'Add Employee'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Employees</p>
                <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Average Attendance</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {Math.round(employees.reduce((acc, emp) => acc + calculateAttendancePercentage(emp), 0) / employees.length)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Salary Payout</p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{employees.reduce((acc, emp) => acc + calculateSalary(emp), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Working Days</p>
                <p className="text-3xl font-bold text-amber-600">{daysInMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">New Employee Details</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get('name');
                const newEmployee = {
                  id: employees.length + 1,
                  name,
                  position: formData.get('position'),
                  dailyWage: Number(formData.get('dailyWage')),
                  attendance: {},
                  avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
                };
                setEmployees([...employees, newEmployee]);
                showNotification(`Added new employee: ${newEmployee.name}`);
                setShowAddForm(false);
                e.target.reset();
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Employee Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Position</label>
                <input
                  type="text"
                  name="position"
                  placeholder="Job position"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Daily Wage (₹)</label>
                <input
                  type="number"
                  name="dailyWage"
                  placeholder="Amount in rupees"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-8 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="overflow-x-auto">
            {viewMode === 'calendar' ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left bg-slate-50 rounded-l-lg">
                      <span className="text-sm font-semibold text-slate-600">Employee</span>
                    </th>
                    {dates.map(date => (
                      <th key={date.toString()} className="px-2 py-4 text-center bg-slate-50">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-500">{format(date, 'EEE')}</span>
                          <span className="text-sm font-semibold text-slate-700">{format(date, 'd')}</span>
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center bg-slate-50 rounded-r-lg">
                      <span className="text-sm font-semibold text-slate-600">Overview</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr key={employee.id} className="group hover:bg-slate-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full bg-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-800">{employee.name}</div>
                            <div className="text-sm text-slate-500">{employee.position}</div>
                          </div>
                        </div>
                      </td>
                      {dates.map(date => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isPresent = employee.attendance[dateStr];
                        return (
                          <td
                            key={date.toString()}
                            className="px-2 py-4 text-center"
                          >
                            <button
                              onClick={() => toggleAttendance(employee.id, date)}
                              className={`w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                                isPresent
                                  ? 'bg-emerald-500 hover:bg-emerald-600'
                                  : 'bg-red-500 hover:bg-red-600'
                              } text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                isPresent ? 'focus:ring-emerald-500' : 'focus:ring-red-500'
                              } group-hover:shadow-lg`}
                            >
                              {isPresent ? 'P' : 'A'}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                            <div
                              className={`h-2.5 rounded-full ${getAttendanceColor(calculateAttendancePercentage(employee))}`}
                              style={{ width: `${calculateAttendancePercentage(employee)}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-slate-600">
                            {calculateAttendancePercentage(employee)}% Present
                          </div>
                          <div className="font-semibold text-emerald-600">
                            ₹{calculateSalary(employee).toLocaleString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map(employee => (
                  <div key={employee.id} className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-16 h-16 rounded-full bg-slate-200"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800">{employee.name}</h3>
                        <p className="text-slate-500">{employee.position}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>Attendance Rate</span>
                          <span>{calculateAttendancePercentage(employee)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getAttendanceColor(calculateAttendancePercentage(employee))}`}
                            style={{ width: `${calculateAttendancePercentage(employee)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Monthly Salary</span>
                        <span className="text-lg font-semibold text-emerald-600">
                          ₹{calculateSalary(employee).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Daily Wage</span>
                        <span className="font-medium text-slate-800">
                          ₹{employee.dailyWage.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Attendance Guide</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 shadow-lg"></div>
              <span className="text-slate-600">Present</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500 shadow-lg"></div>
              <span className="text-slate-600">Absent</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 shadow-lg flex items-center justify-center text-white font-medium">P</div>
              <span className="text-slate-600">Mark Present</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500 shadow-lg flex items-center justify-center text-white font-medium">A</div>
              <span className="text-slate-600">Mark Absent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;