#!/usr/bin/env python3
"""
GreenScore AI Analysis Engine
Processes energy usage data and generates personalized recommendations
"""

import json
import numpy as np
from datetime import datetime, timedelta
import pandas as pd

class EnergyAnalysisEngine:
    def __init__(self):
        # Carbon emission factors by region (kg CO2 per kWh)
        self.emission_factors = {
            'US': 0.5,
            'EU': 0.3,
            'IN': 0.8,
            'CN': 0.7,
            'AU': 0.6,
            'CA': 0.4
        }
        
        # Appliance efficiency benchmarks
        self.efficiency_benchmarks = {
            'ac': {'excellent': 3.5, 'good': 3.0, 'poor': 2.0},  # COP values
            'refrigerator': {'excellent': 100, 'good': 150, 'poor': 250},  # Watts
            'washing_machine': {'excellent': 1500, 'good': 2000, 'poor': 2500},
            'tv': {'excellent': 100, 'good': 200, 'poor': 400},
            'computer': {'excellent': 200, 'good': 300, 'poor': 500}
        }

    def analyze_energy_usage(self, appliances, location='US', bill_data=None):
        """
        Main analysis function that processes appliance data and generates insights
        """
        results = {
            'timestamp': datetime.now().isoformat(),
            'location': location,
            'appliances': [],
            'summary': {},
            'recommendations': [],
            'ai_tips': [],
            'carbon_analysis': {},
            'efficiency_score': 0
        }
        
        total_daily_usage = 0
        total_monthly_cost = 0
        efficiency_scores = []
        
        # Analyze each appliance
        for appliance in appliances:
            analysis = self._analyze_appliance(appliance, location)
            results['appliances'].append(analysis)
            
            total_daily_usage += analysis['daily_usage']
            total_monthly_cost += analysis['monthly_cost']
            efficiency_scores.append(analysis['efficiency_score'])
        
        # Calculate summary metrics
        results['summary'] = {
            'total_daily_usage': round(total_daily_usage, 2),
            'total_monthly_usage': round(total_daily_usage * 30, 2),
            'estimated_monthly_cost': round(total_monthly_cost, 2),
            'carbon_footprint_daily': round(total_daily_usage * self.emission_factors[location], 2),
            'carbon_footprint_monthly': round(total_daily_usage * 30 * self.emission_factors[location], 2)
        }
        
        # Calculate overall efficiency score
        results['efficiency_score'] = round(np.mean(efficiency_scores), 1)
        
        # Generate AI recommendations
        results['recommendations'] = self._generate_recommendations(results['appliances'])
        results['ai_tips'] = self._generate_ai_tips(results['appliances'], results['summary'])
        results['carbon_analysis'] = self._analyze_carbon_impact(results['summary'], location)
        
        return results

    def _analyze_appliance(self, appliance, location):
        """Analyze individual appliance usage and efficiency"""
        name = appliance['name']
        appliance_type = appliance['type']
        wattage = appliance['wattage']
        hours_per_day = appliance['hoursPerDay']
        days_per_week = appliance['daysPerWeek']
        
        # Calculate usage
        daily_usage = (wattage * hours_per_day * days_per_week / 7) / 1000  # kWh
        monthly_usage = daily_usage * 30
        
        # Estimate cost (average $0.15 per kWh)
        monthly_cost = monthly_usage * 0.15
        
        # Calculate efficiency score
        efficiency_score = self._calculate_efficiency_score(appliance_type, wattage, hours_per_day)
        
        # Carbon footprint
        carbon_daily = daily_usage * self.emission_factors[location]
        carbon_monthly = carbon_daily * 30
        
        return {
            'name': name,
            'type': appliance_type,
            'wattage': wattage,
            'daily_usage': round(daily_usage, 2),
            'monthly_usage': round(monthly_usage, 2),
            'monthly_cost': round(monthly_cost, 2),
            'efficiency_score': efficiency_score,
            'carbon_daily': round(carbon_daily, 2),
            'carbon_monthly': round(carbon_monthly, 2),
            'usage_pattern': self._analyze_usage_pattern(hours_per_day, days_per_week)
        }

    def _calculate_efficiency_score(self, appliance_type, wattage, hours_per_day):
        """Calculate efficiency score (0-100) for an appliance"""
        if appliance_type not in self.efficiency_benchmarks:
            return 70  # Default score for unknown types
        
        benchmarks = self.efficiency_benchmarks[appliance_type]
        
        # Score based on wattage compared to benchmarks
        if wattage <= benchmarks['excellent']:
            base_score = 90
        elif wattage <= benchmarks['good']:
            base_score = 70
        else:
            base_score = 40
        
        # Adjust for usage patterns
        if appliance_type == 'ac' and hours_per_day > 12:
            base_score -= 15
        elif appliance_type in ['tv', 'computer'] and hours_per_day > 8:
            base_score -= 10
        
        return max(20, min(100, base_score))

    def _analyze_usage_pattern(self, hours_per_day, days_per_week):
        """Analyze usage patterns and categorize them"""
        if hours_per_day >= 20:
            return 'always_on'
        elif hours_per_day >= 8:
            return 'heavy_use'
        elif hours_per_day >= 4:
            return 'moderate_use'
        else:
            return 'light_use'

    def _generate_recommendations(self, appliances):
        """Generate personalized recommendations based on appliance analysis"""
        recommendations = []
        
        # Find high-usage appliances
        high_usage = [a for a in appliances if a['daily_usage'] > 5]
        if high_usage:
            recommendations.append({
                'type': 'usage_optimization',
                'priority': 'high',
                'title': 'Optimize High-Usage Appliances',
                'description': f"Focus on {', '.join([a['name'] for a in high_usage[:3]])} which consume the most energy",
                'potential_savings': '15-25% energy reduction',
                'actions': [
                    'Adjust usage schedules',
                    'Use energy-saving modes',
                    'Consider timer controls'
                ]
            })
        
        # Find inefficient appliances
        inefficient = [a for a in appliances if a['efficiency_score'] < 60]
        if inefficient:
            recommendations.append({
                'type': 'efficiency_upgrade',
                'priority': 'medium',
                'title': 'Upgrade Inefficient Appliances',
                'description': f"Consider replacing {', '.join([a['name'] for a in inefficient[:2]])}",
                'potential_savings': '20-30% energy reduction',
                'actions': [
                    'Look for ENERGY STAR certified models',
                    'Compare energy ratings',
                    'Calculate payback period'
                ]
            })
        
        # Smart home recommendations
        recommendations.append({
            'type': 'automation',
            'priority': 'low',
            'title': 'Smart Home Integration',
            'description': 'Automate energy management with smart devices',
            'potential_savings': '10-15% energy reduction',
            'actions': [
                'Install smart thermostats',
                'Use smart power strips',
                'Set up automated schedules'
            ]
        })
        
        return recommendations

    def _generate_ai_tips(self, appliances, summary):
        """Generate AI-powered personalized tips"""
        tips = []
        
        # AC optimization tips
        ac_appliances = [a for a in appliances if a['type'] == 'ac']
        for ac in ac_appliances:
            if ac['daily_usage'] > 10:
                tips.append({
                    'category': 'AC Efficiency',
                    'tip': f"Your {ac['name']} uses {ac['daily_usage']} kWh daily. Set temperature to 24°C (75°F) and use ceiling fans to reduce consumption by 20%.",
                    'impact': f"Save {round(ac['daily_usage'] * 0.2, 1)} kWh/day",
                    'tokens': 15,
                    'difficulty': 'Easy',
                    'estimated_savings': round(ac['monthly_cost'] * 0.2, 2)
                })
        
        # Standby power tips
        always_on = [a for a in appliances if a['usage_pattern'] == 'always_on' and a['type'] != 'refrigerator']
        if len(always_on) > 1:
            total_standby = sum(a['daily_usage'] for a in always_on) * 0.1
            tips.append({
                'category': 'Standby Power',
                'tip': 'Multiple devices are always on. Unplug electronics when not in use to eliminate phantom loads.',
                'impact': f"Save {round(total_standby, 1)} kWh/day",
                'tokens': 10,
                'difficulty': 'Easy',
                'estimated_savings': round(total_standby * 30 * 0.15, 2)
            })
        
        # Peak hour optimization
        if summary['total_daily_usage'] > 20:
            tips.append({
                'category': 'Peak Hour Optimization',
                'tip': 'Use high-power appliances during off-peak hours (10 PM - 6 AM) to reduce electricity costs.',
                'impact': 'Save 15-20% on electricity bills',
                'tokens': 12,
                'difficulty': 'Medium',
                'estimated_savings': round(summary['estimated_monthly_cost'] * 0.175, 2)
            })
        
        # Lighting optimization
        lighting = [a for a in appliances if a['type'] == 'lighting']
        if lighting and any(l['wattage'] > 40 for l in lighting):
            tips.append({
                'category': 'Lighting Efficiency',
                'tip': 'Replace remaining incandescent/CFL bulbs with LED. LEDs use 75% less energy and last 25x longer.',
                'impact': 'Save 2-5 kWh/day',
                'tokens': 8,
                'difficulty': 'Easy',
                'estimated_savings': 15
            })
        
        return tips[:4]  # Return top 4 tips

    def _analyze_carbon_impact(self, summary, location):
        """Analyze carbon footprint and provide context"""
        monthly_carbon = summary['carbon_footprint_monthly']
        
        # Carbon impact context
        trees_needed = monthly_carbon / 22  # 1 tree absorbs ~22kg CO2/year
        car_miles = monthly_carbon / 0.4  # ~0.4kg CO2 per mile
        
        return {
            'monthly_emissions': monthly_carbon,
            'annual_projection': round(monthly_carbon * 12, 2),
            'equivalent_trees_needed': round(trees_needed, 1),
            'equivalent_car_miles': round(car_miles, 0),
            'region_average': self._get_regional_average(location),
            'improvement_potential': self._calculate_improvement_potential(monthly_carbon, location)
        }

    def _get_regional_average(self, location):
        """Get regional average carbon footprint for comparison"""
        regional_averages = {
            'US': 600,  # kg CO2/month average household
            'EU': 400,
            'IN': 300,
            'CN': 500,
            'AU': 650,
            'CA': 450
        }
        return regional_averages.get(location, 500)

    def _calculate_improvement_potential(self, current_emissions, location):
        """Calculate potential for improvement"""
        regional_best_practice = self._get_regional_average(location) * 0.7
        if current_emissions > regional_best_practice:
            potential_reduction = current_emissions - regional_best_practice
            return {
                'potential_reduction_kg': round(potential_reduction, 2),
                'potential_reduction_percent': round((potential_reduction / current_emissions) * 100, 1),
                'achievable': True
            }
        else:
            return {
                'potential_reduction_kg': 0,
                'potential_reduction_percent': 0,
                'achievable': False,
                'message': 'You are already performing better than regional best practices!'
            }

def main():
    """Example usage of the AI Analysis Engine"""
    engine = EnergyAnalysisEngine()
    
    # Sample appliance data
    sample_appliances = [
        {
            'name': 'Living Room AC',
            'type': 'ac',
            'wattage': 3500,
            'hoursPerDay': 8,
            'daysPerWeek': 7
        },
        {
            'name': 'Main Refrigerator',
            'type': 'refrigerator',
            'wattage': 150,
            'hoursPerDay': 24,
            'daysPerWeek': 7
        },
        {
            'name': 'Washing Machine',
            'type': 'washing_machine',
            'wattage': 2000,
            'hoursPerDay': 1.5,
            'daysPerWeek': 3
        }
    ]
    
    # Run analysis
    results = engine.analyze_energy_usage(sample_appliances, 'US')
    
    # Print results
    print("=== GreenScore AI Analysis Results ===")
    print(f"Total Daily Usage: {results['summary']['total_daily_usage']} kWh")
    print(f"Monthly Carbon Footprint: {results['summary']['carbon_footprint_monthly']} kg CO₂")
    print(f"Overall Efficiency Score: {results['efficiency_score']}/100")
    print(f"\nTop AI Tips:")
    for i, tip in enumerate(results['ai_tips'][:3], 1):
        print(f"{i}. {tip['tip']}")
        print(f"   Impact: {tip['impact']} | Tokens: {tip['tokens']} GRN")

if __name__ == "__main__":
    main()
