import { RideDetailSegments } from '@interface/ride.interface';
import { Schedule } from '@type/schedule.type';
import { first, last } from 'lodash';

export const mapToSchedule = (path: number[], { segments }: RideDetailSegments) =>
    path.reduce((acc: Schedule[], routeId, i) => {
        const isFirst = first(path) === routeId;
        const isLast = last(path) === routeId;

        const result: Schedule = {
            routeId,
            time: [],
            dwellTime: '',
        };

        switch (true) {
            case isFirst: {
                const [departureTime] = segments[i].time;

                result.time.push(departureTime);
                break;
            }
            case isLast: {
                const [, arrivalTime] = segments[i - 1].time;

                result.time.push('empty', arrivalTime);
                break;
            }
            default: {
                const [, lastArrivalTime] = segments[i - 1].time;
                const [departureTime] = segments[i].time;

                const difference =
                    new Date(departureTime).getTime() - new Date(lastArrivalTime).getTime();
                const dwellTimeInMinutes = Math.round(new Date(difference).getTime() / 60000);
                const dwellTimeInHours = Math.round(dwellTimeInMinutes / 60);

                result.dwellTime =
                    dwellTimeInMinutes > 60 ? `${dwellTimeInHours}h` : `${dwellTimeInMinutes}m`;

                result.time.push(departureTime, lastArrivalTime);
            }
        }

        acc.push(result);

        return acc;
    }, []);
