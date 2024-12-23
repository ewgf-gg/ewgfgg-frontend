"use client";

import { Header } from "@/components/ui/Header";
import { motion } from 'framer-motion';
import { FaGithub, FaDiscord } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-16"
        >
          {/* Website Purpose Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-center text-blue-300">
              About ewgf.gg
            </h2>
            <p className="text-gray-300 text-center">
              <strong>ewgf.gg</strong> is a free and open-source tool designed to provide deeper insights into your Tekken 8 gameplay statistics. 
              Built and maintained by <strong>@the-beef-calculator</strong>, it was inspired by the monthly{' '}
              <em>State of Tekken 8</em> Reddit posts.
            </p>
            <p className="text-gray-300 text-center">
              The application works by pulling historical battle data from{' '}
              <a
                href="https://wank.wavu.wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                https://wank.wavu.wiki
              </a>
              , storing it, and analyzing the data to present the statistics you see here.
            </p>
          </section>

          {/* Limitations Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-center text-blue-300">
              Limitations
            </h2>
            <ul className="space-y-4 text-gray-300 text-center">
              <li>Approximately <strong>6%</strong> of players do not have assigned regions. These players are excluded from region-based statistics.</li>
              <li>
                Battle data gathered <strong>on or before game version 1.2.1</strong> is excluded from most analytics due to gaps in the gameplay data.
              </li>
              <li>Currently, only <strong>ranked matches</strong> are included in the analysis.</li>
            </ul>
          </section>

          {/* Special Thanks Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-center text-blue-300">
              Special Thanks
            </h2>
            <p className="text-gray-300 text-center">
              This project would not have been possible without the support of many amazing people:
            </p>
            <ul className="space-y-2 text-gray-300">
              {[
                'The MVPs @6weetbix and @klaraz for building https://wank.wavu.wiki and making the API publicly available.',
                'Gary, my mentor from a previous internship, for design discussions and valuable suggestions.',
                'My friends Michael and Daniel, as well as my other friends, for offering their thoughts and listening to me yap about this project nonstop.',
                'Members of the ewgf.gg and Tekken Discord/Reddit communities for their feedback and support.'
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <span className="text-blue-400">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </section>

          {/* Contact/Links Section */}
          <section className="text-center space-y-6">
            <h2 className="text-3xl font-semibold text-blue-300">Get in Touch</h2>
            <p className="text-gray-300">
              Have suggestions or found a bug? Join the Discord! Your feedback will help make <strong>ewgf.gg</strong> better for everyone :) 
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.github.com/ewgf-gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href=" https://discord.gg/EUEnH99har"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaDiscord className="w-6 h-6" />
              </a>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
