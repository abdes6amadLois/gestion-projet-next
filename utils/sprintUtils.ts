export const calculateSprintStatus = (
  dateDebut: string,
  dateFin: string,
  currentStatus?: string
): 'planned' | 'active' | 'completed' => {
  const now = new Date();
  const start = new Date(dateDebut);
  const end = new Date(dateFin);

  // On compare uniquement les parties date (pas les heures)
  const nowDate = new Date(now.toISOString().split('T')[0]);     // yyyy-mm-ddT00:00:00.000Z
  const startDate = new Date(start.toISOString().split('T')[0]);
  const endDate = new Date(end.toISOString().split('T')[0]);

  if (currentStatus === 'completed') {
    return 'completed';
  }

  if (nowDate < startDate) {
    return 'planned';
  }

  if (nowDate > endDate) {
    return 'completed';
  }

  return 'active';
};


export const getSprintTimeInfo = (dateDebut: string, dateFin: string) => {
  const now = new Date();
  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  
  const timeProgress = Math.min((daysElapsed / totalDays) * 100, 100);
  const isOverdue = now > end;
  
  return {
    totalDays,
    daysElapsed,
    daysRemaining,
    timeProgress,
    isOverdue
  };
};

export const getSprintStatusBadgeProps = (status: 'planned' | 'active' | 'completed') => {
  switch (status) {
    case 'active':
      return {
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: 'Clock'
      };
    case 'completed':
      return {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'CheckCircle2'
      };
    case 'planned':
      return {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: 'Target'
      };
    default:
      return {
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: 'Target'
      };
  }
};