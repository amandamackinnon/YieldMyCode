export const categories = [
  { label: 'All Categories', value: 'All' },
  { label: 'Bread & Baked Goods', value: 'Bread & Baked Goods' },
  { label: 'Dairy & Eggs', value: 'Dairy & Eggs' },
  { label: 'Fish & Meat', value: 'Fish & Meat' },
  { label: 'Fruit & Veggies', value: 'Fruit & Veggies' },
  { label: 'Grains', value: 'Grains' },
  { label: 'Pasta & Rice', value: 'Pasta & Rice' },
  { label: 'Preserves & Sauces', value: 'Preserves & Sauces' },
  { label: 'Other', value: 'Other' },
];

export const TILE_COLORS = ['#4F6BB7', '#E7B1A6', '#B2DFE8', '#EC6039', '#E7C665', '#699966'];
export const EXPIRED_TILE_COLORS = ['#4F6BB780', '#E7B1A680', '#B2DFE880', '#EC603980', '#E7C66580', '#69996680'];

export const getNotificationData = (fridgeItems) => {
  if (!fridgeItems) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);
  const notifications = [];

  fridgeItems.forEach((item) => {
    if (!item.expiryDate) return;
    try {
      const cleanStr = item.expiryDate.replace(/Expires:\s*/i, '').trim();
      const [day, month, year] = cleanStr.split('/');
      const expiryDateObj = new Date(year, month - 1, day);
      expiryDateObj.setHours(0, 0, 0, 0);

      if (expiryDateObj <= threeDaysFromNow) {
        const daysLeft = Math.round((expiryDateObj - today) / (1000 * 60 * 60 * 24));
        const itemName = item.name.toLowerCase();
        const isPlural = itemName.endsWith('s');
        const expireExpires = isPlural ? 'expire' : 'expires';

        let message = `Your ${itemName} ${expireExpires} soon!`;
        if (daysLeft === 0) message = `The ${itemName} ${expireExpires} today`;
        if (daysLeft === 1) message = `The ${itemName} ${expireExpires} tomorrow`;
        if (daysLeft < 0) message = `The ${itemName} ${isPlural ? 'have' : 'has'} expired!`;

        notifications.push({ id: `expire-${item.id}`, text: message, type: 'expiry', urgent: daysLeft <= 1 });
      }
    } catch (e) { console.log(e); }
  });

  return notifications;
};

export const getDaysLeft = (expiryDateStr) => {
  if (!expiryDateStr || typeof expiryDateStr !== 'string' || expiryDateStr.trim() === '') {
    return { text: 'No Expiry Set', days: 999 };
  }
  try {
    const cleanStr = expiryDateStr.replace(/Expires:\s*/i, '').trim();
    const [dayStr, monthStr, yearStr] = cleanStr.split('/');
    const expiryDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10), 12, 0, 0);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    const diffDays = Math.round((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Expires today', days: 0 };
    if (diffDays === 1) return { text: '1 day left', days: 1 };
    if (diffDays < 0) {
      const positiveDays = Math.abs(diffDays);
      return { text: `${positiveDays} ${positiveDays === 1 ? 'day' : 'days'} ago`, days: diffDays };
    }
    return { text: `${diffDays} days left`, days: diffDays };
  } catch (error) {
    return { text: 'Calc Error', days: 999 };
  }
};