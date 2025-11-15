// Color mapping for skills
const skillColors = {
    'Sleeping': '#667eea',
    'Eating': '#f5576c',
    'Coding': '#00f2fe',
    'Design': '#fbbf24',
    'Leadership': '#10b981',
    'Communication': '#8b5cf6',
    'Problem Solving': '#06b6d4',
    'Creativity': '#ec4899'
};

// Assign colors to skills (same skill = same color)
function getSkillColor(skillName) {
    if (!skillColors[skillName]) {
        const hash = skillName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        skillColors[skillName] = `hsl(${hue}, 70%, 50%)`;
    }
    return skillColors[skillName];
}

// Fetch and render team members
async function loadTeamMembers() {
    try {
        const response = await fetch('script/teamData.json');
        
        if (!response.ok) {
            throw new Error(`Failed to load team data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.memberSkills || data.memberSkills.length === 0) {
            throw new Error('No members found in JSON');
        }
        
        renderMembers(data.memberSkills);
    } catch (error) {
        console.error('Error loading team members:', error);
        document.querySelector('.members-grid').innerHTML = 
            `<p style="color: #f5576c; grid-column: 1/-1; padding: 20px; text-align: center;">Error: ${error.message}</p>`;
    }
}

// Render members on the page
function renderMembers(members) {
    const container = document.querySelector('.members-grid');
    container.innerHTML = '';
    
    members.forEach(member => {
        const memberCard = createMemberCard(member);
        container.appendChild(memberCard);
    });
}

// Create a single member card
function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';
    
    const photoDiv = document.createElement('div');
    photoDiv.className = 'member-photo';
    
    const circleBackground = document.createElement('div');
    circleBackground.className = 'circle-background';
    
    const img = document.createElement('img');
    img.src = member.profile || 'assets/placeholder.jpg';
    img.alt = member.name;
    img.className = 'member-image';
    
    circleBackground.appendChild(img);
    photoDiv.appendChild(circleBackground);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'member-info';
    
    const nameHeading = document.createElement('h2');
    nameHeading.className = 'member-name';
    nameHeading.textContent = member.name;
    infoDiv.appendChild(nameHeading);
    
    const roleParagraph = document.createElement('p');
    roleParagraph.className = 'member-role';
    roleParagraph.textContent = member.role;
    infoDiv.appendChild(roleParagraph);
    
    const skillsDiv = document.createElement('div');
    skillsDiv.className = 'skills';
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'skills-chart';
    
    Object.entries(member.skill).forEach(([skillName, skillValue]) => {
        const color = getSkillColor(skillName);
        
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        const skillLabel = document.createElement('div');
        skillLabel.className = 'skill-label';
        skillLabel.textContent = skillName;
        
        const skillProgress = document.createElement('div');
        skillProgress.className = 'skill-progress';
        skillProgress.style.setProperty('--skill-value', skillValue);
        skillProgress.style.setProperty('--skill-color', color);
        
        const skillPercentage = document.createElement('div');
        skillPercentage.className = 'skill-percentage';
        skillPercentage.textContent = `${skillValue}%`;
        
        skillProgress.appendChild(skillPercentage);
        skillItem.appendChild(skillLabel);
        skillItem.appendChild(skillProgress);
        chartContainer.appendChild(skillItem);
    });
    
    skillsDiv.appendChild(chartContainer);
    infoDiv.appendChild(skillsDiv);
    
    card.appendChild(photoDiv);
    card.appendChild(infoDiv);
    
    return card;
}

document.addEventListener('DOMContentLoaded', loadTeamMembers);
setInterval(loadTeamMembers, 5000);