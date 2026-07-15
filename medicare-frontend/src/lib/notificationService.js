// Notification service - checks reminder times and fires browser notifications
let notificationInterval = null;
let notifiedKeys = new Set(); // Track which reminders already notified today

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const startReminderChecker = (medicines, onReminderFire) => {
  if (notificationInterval) clearInterval(notificationInterval);

  const checkReminders = () => {
    if (!medicines || medicines.length === 0) return;

    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;
    const todayKey = now.toISOString().split('T')[0];

    medicines.forEach((med) => {
      med.reminderTimes?.forEach((time) => {
        const key = `${todayKey}-${med._id}-${time}`;
        if (time === currentTime && !notifiedKeys.has(key)) {
          notifiedKeys.add(key);

          // Fire browser notification
          if (Notification.permission === 'granted') {
            const notification = new Notification(`💊 Time to take ${med.name}!`, {
              body: `Dosage: ${med.dosage} — Scheduled at ${time}`,
              icon: '/pill-icon.png',
              tag: key,
            });
            // Auto-close after 10 seconds
            setTimeout(() => notification.close(), 10000);
          }

          // Also call a callback so the UI can react
          if (onReminderFire) onReminderFire(med, time);
        }
      });
    });
  };

  // Check immediately, then every 30 seconds
  checkReminders();
  notificationInterval = setInterval(checkReminders, 30000);
  return () => clearInterval(notificationInterval);
};

export const stopReminderChecker = () => {
  if (notificationInterval) clearInterval(notificationInterval);
};
