import { RideSegment } from '@interface/ride.interface';
import { last } from 'lodash';

export const parseToRequest = (formValue: RideSegment[]): RideSegment[] => {
    return formValue.reduce((acc: RideSegment[], segment, i) => {
        const isLast = last(formValue) === formValue[i];
        const {
            time: [departureTime],
        } = segment;

        if (!isLast) {
            const nextSegmentArrivalTime = last(formValue[i + 1].time);

            acc.push({
                ...segment,
                time: [
                    new Date(departureTime).toISOString(),
                    new Date(`${nextSegmentArrivalTime}`).toISOString(),
                ],
            });
        }

        return acc;
    }, []);
};
