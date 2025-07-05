import React from 'react';
import HeroSection from '../About/HeroSection';
import Timeline from '../About/Timeline';
import PersonalIntro from '../About/PersonalInto';
import SplitLayout from '../About/SplitLayout';
import MissionVision from '../About/MissionVision';
import TeamSection from '../About/TeamSection';
import Testimonials from '../About/Testimonials';

import Gallery from '../About/Gallery';
import CallToAction from '../About/CallToAction';
import StatsCounter from '../About/StatsCounter';

const About = () => {
    return (
        <div>
            <HeroSection />
            <Timeline />
            <PersonalIntro />
            <SplitLayout />
            <MissionVision />
            <TeamSection />
            <Testimonials />
          <StatsCounter />
            <Gallery />
            <CallToAction />
        </div>
    );
};

export default About;