import Activity from '../models/Activity.js';
import { connectToDatabase, disconnectDatabase } from '../config/database.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
const seedDatabase = async () => {
    console.log('Seed the octofit_db database with test data');
    await connectToDatabase();
    await Promise.all([
        User.deleteMany({}),
        Team.deleteMany({}),
        Activity.deleteMany({}),
        Leaderboard.deleteMany({}),
        Workout.deleteMany({}),
    ]);
    const users = await User.insertMany([
        { name: 'Maya Chen', email: 'maya.chen@octofit.dev', fitnessLevel: 'intermediate' },
        { name: 'Jordan Reyes', email: 'jordan.reyes@octofit.dev', fitnessLevel: 'advanced' },
        { name: 'Priya Nair', email: 'priya.nair@octofit.dev', fitnessLevel: 'beginner' },
        { name: 'Noah Brooks', email: 'noah.brooks@octofit.dev', fitnessLevel: 'intermediate' },
    ]);
    await Team.insertMany([
        {
            name: 'Morning Milers',
            description: 'Early run crew focused on weekly distance goals.',
            memberIds: [users[0]._id, users[1]._id],
        },
        {
            name: 'Strength Syndicate',
            description: 'Progressive overload team for full-body strength cycles.',
            memberIds: [users[1]._id, users[2]._id, users[3]._id],
        },
    ]);
    await Activity.insertMany([
        {
            userId: users[0]._id,
            type: 'Tempo Run',
            durationMinutes: 42,
            caloriesBurned: 510,
            completedAt: new Date('2026-06-15T06:30:00Z'),
        },
        {
            userId: users[1]._id,
            type: 'HIIT Circuit',
            durationMinutes: 35,
            caloriesBurned: 460,
            completedAt: new Date('2026-06-16T18:00:00Z'),
        },
        {
            userId: users[2]._id,
            type: 'Mobility Flow',
            durationMinutes: 25,
            caloriesBurned: 180,
            completedAt: new Date('2026-06-17T07:10:00Z'),
        },
        {
            userId: users[3]._id,
            type: 'Lower Body Strength',
            durationMinutes: 50,
            caloriesBurned: 540,
            completedAt: new Date('2026-06-18T17:20:00Z'),
        },
    ]);
    await Leaderboard.insertMany([
        { userId: users[1]._id, points: 1230, rank: 1, period: '2026-W25' },
        { userId: users[3]._id, points: 1110, rank: 2, period: '2026-W25' },
        { userId: users[0]._id, points: 980, rank: 3, period: '2026-W25' },
        { userId: users[2]._id, points: 730, rank: 4, period: '2026-W25' },
    ]);
    await Workout.insertMany([
        {
            title: 'Explosive Legs 30',
            focusArea: 'Lower Body Power',
            difficulty: 'intermediate',
            durationMinutes: 30,
            instructions: [
                'Warm up with 5 minutes of dynamic stretches.',
                'Complete 4 rounds of jump squats, reverse lunges, and kettlebell swings.',
                'Cool down with glute and hamstring mobility drills.',
            ],
        },
        {
            title: 'Core Stability Builder',
            focusArea: 'Core Endurance',
            difficulty: 'beginner',
            durationMinutes: 20,
            instructions: [
                'Perform dead bugs and bird dogs in slow controlled reps.',
                'Alternate side planks and front planks for 3 sets.',
                'Finish with diaphragmatic breathing for recovery.',
            ],
        },
        {
            title: 'Upper Body Engine',
            focusArea: 'Push/Pull Strength',
            difficulty: 'advanced',
            durationMinutes: 45,
            instructions: [
                'Superset pull-ups and push presses for 5 rounds.',
                'Add bent-over rows and weighted dips for hypertrophy.',
                'Finish with battle rope intervals.',
            ],
        },
    ]);
    console.log('Database seed complete.');
};
seedDatabase()
    .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
})
    .finally(async () => {
    await disconnectDatabase();
});
