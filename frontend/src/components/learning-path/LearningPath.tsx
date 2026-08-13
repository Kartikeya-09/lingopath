import React, { useEffect, useRef } from 'react';
import { CoursePath } from '@/types/api';
import { UnitBanner } from './UnitBanner';
import { PathNode } from './PathNode';

interface LearningPathProps {
  course: CoursePath;
}

export function LearningPath({ course }: LearningPathProps) {
  const activeNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [course]);

  let globalLessonIndex = 0;

  return (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto px-4 py-8 pb-32">
      {course.units.map((unit) => (
        <div key={`unit-${unit.id}`} className="w-full mb-12">
          <UnitBanner unit={unit} />
          
          <div className="flex flex-col items-center w-full relative">
            {/* The SVG path connecting nodes could be drawn here, but we'll stick to a simpler visual for MVP */}
            {unit.skills.map((skill) => (
              <React.Fragment key={`skill-${skill.id}`}>
                {skill.lessons.map((lesson) => {
                  const currentIndex = globalLessonIndex++;
                  const isActive = lesson.state === 'available' || lesson.state === 'in_progress';
                  
                  return (
                    <div 
                      key={`lesson-${lesson.id}`} 
                      className="w-full flex justify-center"
                      ref={isActive ? activeNodeRef : null}
                    >
                      <PathNode 
                        id={lesson.id}
                        state={lesson.state}
                        index={currentIndex}
                        total={100}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
