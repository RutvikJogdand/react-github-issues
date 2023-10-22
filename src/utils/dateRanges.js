export function getDateRangeForWeeks(weeksCount) {
    const dateRanges = [];
  
    // Get the current date
    const currentDate = new Date();
  
    for (let i = 0; i < weeksCount; i++) {
      // Calculate the start of the week for the current iteration
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() + 7 * i));
  
      // Calculate the end of the week
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
  
      // Push the date range to the result
      dateRanges.push({
        start: startOfWeek,
        end: endOfWeek,
      });
    }
  
    return dateRanges;
  }
  
  // Get date ranges for the last 10 weeks
//   const dateRanges = getDateRangeForWeeks(10);
  
  // Output the date ranges
//   dateRanges.forEach((dateRange, index) => {
//     const startDate = dateRange.start.toISOString().split('T')[0];
//     const endDate = dateRange.end.toISOString().split('T')[0];
//     console.log(`Week ${index + 1}: ${startDate} to ${endDate}`);
//   });
  