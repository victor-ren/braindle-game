import { getUserData } from './db_conn.js';

function displayUserData(userData) {
    const currentStreakElement = document.querySelector('#current-streak');
    const maxStreakElement = document.querySelector('#max-streak');
    const totalScoreElement = document.querySelector('#total-score');
    const mathsSolvedElement = document.querySelector('#maths-solved');
    const riddlesSolvedElement = document.querySelector('#riddles-solved');
    const patternsSolvedElement = document.querySelector('#patterns-solved');
  
    currentStreakElement.textContent = userData.current_streak || '0';
    maxStreakElement.textContent = userData.max_streak || '0';
    totalScoreElement.textContent = userData.total_score || '0';
    mathsSolvedElement.textContent = userData.maths_solved || '0';
    riddlesSolvedElement.textContent = userData.riddles_solved || '0';
    patternsSolvedElement.textContent = userData.patterns_solved || '0';
}

function getLast10Days() {
    const dates = [];
    for (let i = 9; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = ((date.getMonth() + 1) + '').padStart(2, '0') + '/' + (date.getDate() + '').padStart(2, '0');
        dates.push(formattedDate);
    }
    return dates;
}

function updateDateCells(dates) {
    console.log("Updating dates", dates);
    dates.forEach((date, index) => {
        const dateElement = document.getElementById(`date-${index}`);
        if (dateElement) {
            dateElement.textContent = date;
            console.log(`Updated date-${index} with ${date}`); //debug
        } else {
            console.error(`date-${index} element not found`); //debug
        }
    });
}

function updateActivityIcons(dayIndex, dayActivity) {
    const mathCell = document.getElementById(`math-${dayIndex}`);
    const riddleCell = document.getElementById(`riddle-${dayIndex}`);
    const patternCell = document.getElementById(`pattern-${dayIndex}`);
    const scoreCell = document.getElementById(`score-${dayIndex}`);

    if (dayActivity) {
        mathCell.innerHTML = getActivityIcon(dayActivity.math);
        riddleCell.innerHTML = getActivityIcon(dayActivity.riddle);
        patternCell.innerHTML = getActivityIcon(dayActivity.pattern);
        scoreCell.textContent = dayActivity.dailyScore || ''; 
    } else {
        mathCell.innerHTML = getActivityIcon('unattempted');
        riddleCell.innerHTML = getActivityIcon('unattempted');
        patternCell.innerHTML = getActivityIcon('unattempted');
        scoreCell.textContent = '';
    }
}

function getActivityIcon(activityStatus) {
    switch (activityStatus) {
        case 'completed':
            return '<i class="fa fa-check"></i>';
        case 'failed':
            return '<i class="fa fa-times"></i>';
        default:
            return '<i class="fa fa-minus"></i>';
    }
}

function displayLast10DaysActivities(userData) {
    const last10Days = getLast10Days();
    last10Days.forEach((date, index) => {
        const dayActivity = userData.dailyActivities.find(activity => activity.date === date);
        if (dayActivity) {
            updateActivityIcons(index, dayActivity);
        } else {
            updateActivityIcons(index, { math: 'unattempted', riddle: 'unattempted', pattern: 'unattempted', dailyScore: '' });
        }
    });
}

const currentUsername = sessionStorage.getItem('username');

if (currentUsername) {
    getUserData(currentUsername)
      .then(userData => {
          displayUserData(userData);
          updateDateCells(getLast10Days());
          displayLast10DaysActivities(userData);
      })
      .catch(error => console.error('Failed to load user data:', error));
} else {
    console.log('No user is currently logged in.');
    updateDateCells(getLast10Days());
}