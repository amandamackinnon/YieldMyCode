export const getTotalItemsAdded = (activityLog) => {
  return activityLog.filter(
    log => log.action === 'added'
  ).length;
};

export const getTotalItemsRemoved = (activityLog) => {
  return activityLog.filter(
    log => log.action === 'removed'
  ).length;
};

export const getItemsByCategory = (activityLog) => {

  const categoryCounts = {};

  activityLog.forEach(log => {

    if (log.action === 'added') {

      const category = log.category || 'Other';

      categoryCounts[category] =
        (categoryCounts[category] || 0) + 1;
    }
  });

  return categoryCounts;
};

export const getWeeklyActivity = (activityLog) => {

  const days = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  activityLog.forEach(log => {

    const date = new Date(log.timestamp);

    const dayName =
      date.toLocaleDateString('en-US', {
        weekday: 'short',
      });

    if (days[dayName] !== undefined) {
      days[dayName] += 1;
    }
  });

  return days;
};

export const getTopFoods = (activityLog) => {

  const foodCounts = {};

  activityLog.forEach(log => {

    if (log.action === 'added') {

      foodCounts[log.itemName] =
        (foodCounts[log.itemName] || 0) + 1;
    }
  });

  return Object.entries(foodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
};
